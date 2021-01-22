import * as assert from "assert";
import baretest from "baretest";
import { InitCommand } from "../commands/init";
import { NullLogger } from "../lib/logger";
import { LadingBackendDouble } from "./doubles";

export const test: any = baretest("init");

test("init should provision the application with the lading server", async () => {
  const backend = new LadingBackendDouble();
  const initCommand = new InitCommand(new NullLogger(), backend, {
    applicationName: "some-application",
  });
  await initCommand.run();
  assert.strictEqual(backend.initCalls, 1);
});
