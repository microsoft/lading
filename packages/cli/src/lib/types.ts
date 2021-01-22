export interface LadingBackend {
  init(applicationName: string): Promise<void>;
  addPackageVersion(
    applicationName: string,
    packageName: string,
    version: string
  ): Promise<void>;
}
export interface PackageUpdater {
  addDevDependency(arg0: string): Promise<void>;
}
export interface AddCommandOptions {
  packageVersion: string;
  applicationName: string;
  packageName: string;
}

export interface InitCommandOptions {
  applicationName: string;
}
export type ParsedCommand = {
  applicationName: string;
  command: "add" | "init";
};

export type ParsedAddCommand = ParsedCommand & AddCommandOptions;
export type ParsedInitCommand = ParsedCommand & InitCommandOptions;
