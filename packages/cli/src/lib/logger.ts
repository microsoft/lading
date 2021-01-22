import debug from "debug";

export interface Logger {
  info(str: string): void;
  warn(str: string): void;
  error(str: string): void;
  important(str: string): void;
}

export class DefaultLogger implements Logger {
  private debug = debug("lading:cli");

  info(str: string): void {
    this.debug(str);
  }
  warn(str: string): void {
    this.debug(str);
  }
  error(str: string): void {
    this.debug(str);
  }
  important(str: string) {
    console.log(str);
  }
}

export class NullLogger implements Logger {
  importantCalls = 0;
  info(str: string): void {}
  warn(str: string): void {}
  error(str: string): void {}
  important(str: string) {
    this.importantCalls += 1;
  }
}
