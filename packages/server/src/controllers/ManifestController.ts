import { Constant, Controller, Get, PathParams } from "@tsed/common";
import { SwaggerSettings } from "@tsed/swagger";
import { Returns } from "@tsed/schema";
import { ManifestRepository } from "../repositories/ManifestRepository";

@Controller("/manifest")
export class ManifestsController {
  @Constant("swagger")
  swagger: SwaggerSettings[];

  constructor(private manifestRepository: ManifestRepository) {}

  @Get("/:name")
  @(Returns(200, String).ContentType("application/json"))
  async get(@PathParams("name") name: string) {
    const manifest = await this.manifestRepository.greedyFindByName(name);
    return manifest?.payload;
  }
}
