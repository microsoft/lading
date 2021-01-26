# Lading Client code

This code is used to bootstrap the module federation endpoints for remoteEntry's. It is meant to be small and light, therefore, it is appropriate to handcraft the JS files (avoiding any tslib tax). The source is written in pure JavaScript with JSDoc to allow this code to output typings (d.ts) via the TypeScript compilation.

## Build

Simply run `yarn build` to generate the d.ts files. If typing can be ignored, simply use the JavaScript files outright.
