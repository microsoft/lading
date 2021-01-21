const webpack = require("webpack");
const path = require("path");
const { remoteExternal } = require("@lading/webpack");

/*
{
  "@fluentui/react":
    "fluentuiReact@https://lading.blob.core.windows.net/bundle/%40fluentui/react/v8.0.0-beta.34/remoteEntry.js",
} 
*/

module.exports = {
  entry: "./src/index",
  optimization: {
    minimize: false,
  },
  mode: "development",
  devtool: "source-map",
  module: {
    rules: [
      {
        test: /\.js$/,
        exclude: /node_modules/,
        use: {
          loader: "babel-loader",
          options: {
            presets: ["@babel/preset-env", "@babel/preset-react"],
          },
        },
      },
    ],
  },
  plugins: [
    new webpack.container.ModuleFederationPlugin({
      remotes: {
        "@fluentui/react": remoteExternal("fluentuiReact"),
      },
      shared: {
        react: {
          singleton: true,
        },
        "react-dom": {
          singleton: true,
        },
      },
    }),
  ],
  devServer: {
    writeToDisk: true,
    hot: false,
  },
};
