# Cloudpack

A automated CDN population service for automatically generating bundles for website rendering.

DISCLAIMER: This is in an experimental state. All commentary is draft.

## Usage

```bash
yarn start
```

## Details

Cloudpack produces bundles on demand for any npm package. Why? So many reasons!

In development mode:

- Bundles produced treat each package as a federated module
- The version of the module may be changed out on the fly to validate new builds
- Dependencies can be redirected to localhost or serviced versions
- Dependency versions used can be resolved through the NPM package, but overridden using

In production mode:

- All modules are staticly bundled
- Lading version overrides apply
- Feature flags in the lading manifest can be used to strip out disabled features

## Why on-demand bundles?

### Testability

Want to test library changes in a deployed application without figuring out how to actually deploy the application? Cloudpack makes it easy by producing development app bundles that can sideload just your library changes.

### Serviability

Want to change out a dependency and re-rerun tests without cloning? Cloudpack uses the Lading service to allow dependency versions to be configured on demand, causing bundles to be rebuilt and served dynamically.

### Optimized output

Want to toggle a feature flag to enable new features? No problem. Using the Lading administration site, you can toggle a feature which will cause script requests for the application to deliver re-bundled output, eliminating an unused code no longer hit by toggling the flag.
