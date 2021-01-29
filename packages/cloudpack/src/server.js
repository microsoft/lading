const express = require("express");
const fs = require("fs");
const app = express();
const port = 3000;
const path = require("path");
const { execSync } = require("child_process");
const camelCase = require("camelcase");

/**
 * Helper to translate node package names into MF safe variable names.
 */
const makeFriendly = (str) =>
  camelCase(str.replace("/", "-").replace("@", "-"));

/**
 * Helper to resolve the package version.
 */
const getLatestVersion = (packageName, partialVersion) => {
  const resultString = execSync(
    `npm show ${packageName}@${partialVersion} version --json`
  ).toString();

  console.log(resultString);
  const result = JSON.parse(resultString);

  if (Array.isArray(result)) {
    return result[result.length - 1];
  }

  return result;
};

/**
 * Main express handler.
 */
app.get("*", (req, res) => {
  // Regex to pull the package name, version, and resource path.
  const matches = req.path.match(
    /[\/]?(@[a-z-A-Z0-9]+\/[a-z-A-Z0-9]+|[a-zA-Z-0-9]+)(@[a-zA-Z-0-9.]+)?(\/[\/a-zA-Z-_0-9.]+)?/
  );

  const packageName = matches[1];
  const version = (matches[2] || "").substr(1);
  const requestedFilePath = matches[3] || "/remoteEntry.js";
  const tmpDir = path.join(__dirname, "temp", "bundles", packageName, version);
  const cacheDir = path.join(__dirname, "temp", "output", packageName, version);
  const requestedFullPath = path.join(cacheDir, requestedFilePath);

  if (!packageName) {
    req.statusCode(500).send("Invalid package name.");
    return;
  }

  // Resolve version
  const resolvedVersion = getLatestVersion(packageName, version);

  if (version !== resolvedVersion) {
    res.redirect(
      `${req.baseUrl}/${packageName}@${resolvedVersion}${requestedFilePath}`
    );
    return;
  }

  if (req.query.force === undefined && fs.existsSync(cacheDir)) {
    if (fs.existsSync(requestedFullPath)) {
      console.log(`Cache hit: ${packageName}@${version}/${requestedFilePath}`);

      res.type(path.extname(requestedFullPath));
      res.send(fs.readFileSync(requestedFullPath));
    } else {
      console.log(
        `Missing file: ${packageName}@${version}/${requestedFilePath}`
      );
      res.sendStatus(404);
    }

    return;
  }

  // Not found; we need to build it.
  console.log(
    `Request: { name: ${packageName}, version: ${version}, path: ${requestedFilePath} }`
  );

  fs.mkdirSync(tmpDir, { recursive: true });

  const bundlePackage = {
    name: `${packageName}-bundle`,
    version,
    scripts: {
      build: "webpack --config webpack.config.js",
    },
    dependencies: {
      [packageName]: version,
    },
    devDependencies: {
      webpack: "^5",
      "webpack-cli": "^4",
    },
  };

  fs.writeFileSync(
    path.join(tmpDir, `package.json`),
    JSON.stringify(bundlePackage, null, 2),
    "utf8"
  );

  console.log(`Installing dependencies in "${tmpDir}"...`);

  // Install package
  execSync("yarn", { cwd: tmpDir, env: process.env, stdio: "inherit" });

  console.log(`Done installing.`);

  // Load the package's definition
  const package = require(path.join(
    tmpDir,
    "node_modules",
    packageName,
    "package.json"
  ));
  const peerDependencies = {};
  let hasPeers = false;

  // Filter out @types
  if (package.peerDependencies) {
    for (let peer of Object.keys(package.peerDependencies)) {
      if (peer.indexOf("@types/") === -1) {
        peerDependencies[peer] = package.peerDependencies[peer];
        hasPeers = true;
      }
    }
  }

  console.log("peers", peerDependencies);

  if (hasPeers) {
    console.log("Has extra peers:", peerDependencies);

    bundlePackage.dependencies = {
      ...bundlePackage.dependencies,
      ...peerDependencies,
    };

    // Rewrite the definition to include peer dependencies
    fs.writeFileSync(
      path.join(tmpDir, `package.json`),
      JSON.stringify(bundlePackage, null, 2),
      "utf8"
    );

    // Install extras.
    execSync("yarn", { cwd: tmpDir, env: process.env, stdio: "inherit" });
  }
  const exposes = {};

  exposes["."] = path.join(
    packageName,
    package.module || package.main || "./index.js"
  );

  const remotes = {};

  if (package.dependencies) {
    for (dep of Object.keys(package.dependencies)) {
      const depPackage = require(path.join(
        tmpDir,
        "node_modules",
        dep,
        "package.json"
      ));

      remotes[dep] = `${makeFriendly(dep)}@http://localhost:3000/${dep}@${
        depPackage.version
      }/remoteEntry.js`;
    }
  }

  const shared = {};
  if (package.peerDependencies) {
    for (dep of Object.keys(package.peerDependencies)) {
      shared[dep] = { singleton: true };
    }
  }

  console.log(package);

  // Next, create a webpack config.
  fs.writeFileSync(
    path.join(tmpDir, "webpack.config.js"),
    `
const webpack = require("webpack");
const path = require("path");
const fs = require("fs");

module.exports = {
  mode: "${req.query.min !== undefined ? "production" : "development"}",
  entry: {},
  cache: false,
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      name: ${JSON.stringify(makeFriendly(packageName))},
      filename: "remoteEntry.js",
      exposes: ${JSON.stringify(exposes, null, 2)},
      remotes: ${JSON.stringify(remotes, null, 2)},
      shared: ${JSON.stringify(shared, null, 2)},
    }),
  ],
};
    `,
    "utf8"
  );

  // Now run webpack to produce a bundle.
  execSync("yarn build", { cwd: tmpDir, env: process.env, stdio: "inherit" });

  console.log();

  // Now move dist into the cache folder.
  fs.rmdirSync(cacheDir, { recursive: true, force: true });
  fs.mkdirSync(path.join(__dirname, "temp", "output", packageName), {
    recursive: true,
  });
  fs.renameSync(path.join(tmpDir, "dist"), cacheDir);

  if (fs.existsSync(cacheDir)) {
    if (fs.existsSync(requestedFullPath)) {
      res.type(path.extname(requestedFullPath));
      res.send(fs.readFileSync(requestedFullPath));
    } else {
      res.sendStatus(404);
    }

    return;
  }
});

app.listen(port, () => {
  console.log(`Cloudpack: listening at http://localhost:${port}`);
});
