import { Cli } from "../cli";
import { DefaultLogger } from "../lib/logger";

async function run() {
  const cli = new Cli(new DefaultLogger());
  await cli.run(process.argv.slice(2));
}
run();
