import { Logger } from "./logger";
import { LadingBackend } from "./types";
import axios from "axios";
export class LadingBackendImpl implements LadingBackend {
  constructor(private logger: Logger) {}
  async init(applicationName: string) {
    await axios.post;
  }
  async addPackageVersion(
    applicationName: string,
    packageName: string,
    version: string
  ) {}
}
