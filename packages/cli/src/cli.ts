import { ArgumentParser } from "argparse";
import { AddCommand } from "./commands/add";
import { InitCommand } from "./commands/init";
import { LadingBackendImpl } from "./lib/backend";
import { Logger } from "./lib/logger";
import { PackageUpdaterImpl } from "./lib/package-updater";
import {
  ParsedAddCommand,
  ParsedCommand,
  ParsedInitCommand,
} from "./lib/types";

const parser = new ArgumentParser({ description: "@lading/cli" });
parser.add_argument("application");
const sub_parser = parser.add_subparsers({
  description: "commands",
  dest: "command",
});
const add_parser = sub_parser.add_parser("add");
add_parser.add_argument("packageName");
sub_parser.add_parser("init");

export class Cli {
  constructor(private logger: Logger) {}

  async run(args: string[]): Promise<void> {
    const parsedCommand: ParsedCommand = parser.parse_args(args);
    if (parsedCommand.command === "add") {
      const packageUpdater = new PackageUpdaterImpl();
      const addCommand = new AddCommand(
        this.logger,
        new LadingBackendImpl(this.logger),
        packageUpdater,
        parsedCommand as ParsedAddCommand
      );
      await addCommand.run();
    } else if (parsedCommand.command === "init") {
      const initCommand = new InitCommand(
        this.logger,
        new LadingBackendImpl(this.logger),
        parsedCommand as ParsedInitCommand
      );
      await initCommand.run();
    } else {
      this.logger.error("Command not recognized!");
      throw new Error("Command not recognized!");
    }
  }
}
