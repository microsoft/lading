import { Logger } from "../lib/logger";
import { InitCommandOptions, LadingBackend } from "../lib/types";

export class InitCommand {
  constructor(
    private logger: Logger,
    private backend: LadingBackend,
    private options: InitCommandOptions
  ) {}

  async run() {
    await this.backend.init(this.options.applicationName);
  }
}
