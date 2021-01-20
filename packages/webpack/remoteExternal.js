const webpack = require("webpack");

module.exports = function remoteExternal(remoteName) {
  return {
    external: `promise "use strict";
    var error = new Error();
    module.exports = new Promise((resolve, reject) => {
      if(typeof ${remoteName} !== "undefined") return resolve();
      ${webpack.RuntimeGlobals.loadScript}(__LADING_MANIFEST__.${remoteName}, (event) => {
        if(typeof ${remoteName} !== "undefined") return resolve();
        var errorType = event && (event.type === 'load' ? 'missing' : event.type);
        var realSrc = event && event.target && event.target.src;
        error.message = 'Loading script failed.\\n(' + errorType + ': ' + realSrc + ')';
        error.name = 'ScriptExternalLoadError';
        error.type = errorType;
        error.request = realSrc;
        reject(error);
      }, "${remoteName}");
    }).then(() => ${remoteName});`,
  };
};
