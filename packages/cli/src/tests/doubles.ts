import { LadingBackend, PackageUpdater } from "../lib/types";

export class LadingBackendDouble implements LadingBackend {
  public initCalls = 0;
  public addPackageVersionCalls = 0;

  async init() {
    this.initCalls += 1;
  }

  async addPackageVersion(packageName: string) {
    this.addPackageVersionCalls += 1;
  }
}

export class PackageUpdaterDouble implements PackageUpdater {
  devDependencies: { [packageName: string]: string } = {};

  async addDevDependency(packageName: string) {
    this.devDependencies[packageName] = "*";
  }
}
