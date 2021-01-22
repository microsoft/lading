import { Logger } from "../lib/logger";
import { AddCommandOptions, LadingBackend, PackageUpdater } from "../lib/types";

export class AddCommand {
  constructor(
    private logger: Logger,
    private backend: LadingBackend,
    private packageUpdater: PackageUpdater,
    private options: AddCommandOptions
  ) {}
  async run() {
    await this.packageUpdater.addDevDependency(
      `@lading/types-${this.options.packageName}`
    );
    await this.backend.addPackageVersion(
      this.options.applicationName,
      this.options.packageName,
      this.options.packageVersion
    );
    this.logger.important(
      `Package ${this.options.packageName} added; please run your package manager install (eg npm i, yarn, etc) to complete this process.`
    );
  }
}
