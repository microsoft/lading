import * as assert from "assert";
import baretest from "baretest";
import { AddCommand } from "../commands/add";
import { NullLogger } from "../lib/logger";
import { LadingBackendDouble, PackageUpdaterDouble } from "./doubles";

export const test: any = baretest("add");

test("add appends the appropriate type package to package.json", async () => {
  const packageUpdater = new PackageUpdaterDouble();
  const cmd = new AddCommand(
    new NullLogger(),
    new LadingBackendDouble(),
    packageUpdater,
    {
      packageName: "some-package",
      applicationName: "some-application",
      packageVersion: "1.0.0",
    }
  );
  await cmd.run();
  assert.deepStrictEqual(Object.keys(packageUpdater.devDependencies), [
    "@lading/types-some-package",
  ]);
});

test("add provisions the dependency in the manifest", async () => {
  const backend = new LadingBackendDouble();
  const cmd = new AddCommand(
    new NullLogger(),
    backend,
    new PackageUpdaterDouble(),
    {
      packageName: "some-package",
      applicationName: "some-application",
      packageVersion: "1.0.0",
    }
  );
  await cmd.run();
  assert.strictEqual(backend.addPackageVersionCalls, 1);
});

test("add notifies the user to run their package manager", async () => {
  const logger = new NullLogger();
  const cmd = new AddCommand(
    logger,
    new LadingBackendDouble(),
    new PackageUpdaterDouble(),
    {
      packageName: "some-package",
      applicationName: "some-application",
      packageVersion: "1.0.0",
    }
  );
  await cmd.run();
  assert.strictEqual(logger.importantCalls, 1);
});
