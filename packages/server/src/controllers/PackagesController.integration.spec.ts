import { PlatformTest } from "@tsed/common";
import SuperTest from "supertest";
import { PackagesController } from "./PackagesController";
import { Server } from "../Server";

describe("PackagesController", () => {
  let request: SuperTest.SuperTest<SuperTest.Test>;

  beforeEach(PlatformTest.bootstrap(Server, {
    mount: {
      "/": [PackagesController]
    }
  }));
  beforeEach(() => {
    request = SuperTest(PlatformTest.callback());
  });

  afterEach(PlatformTest.reset);

  it("should call GET /packages", async () => {
     const response = await request.get("/packages").expect(200);

     expect(response.text).toEqual("hello");
  });
});
