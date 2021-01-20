import { PlatformTest } from "@tsed/common";
import { PackagesController } from "./PackagesController";

describe("PackagesController", () => {
  beforeEach(PlatformTest.create);
  afterEach(PlatformTest.reset);

  it("should do something", () => {
    const instance = PlatformTest.get<PackagesController>(PackagesController);
    // const instance = PlatformTest.invoke<PackagesController>(PackagesController); // get fresh instance

    expect(instance).toBeInstanceOf(PackagesController);
  });
});
