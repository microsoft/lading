import {
  Constant,
  Controller,
  Get,
  Post,
  HeaderParams,
  PathParams,
  BodyParams,
  View,
  Redirect,
  Context,
} from "@tsed/common";
import { Hidden, SwaggerSettings } from "@tsed/swagger";
import { Returns } from "@tsed/schema";
import { PackageRepository } from "../repositories/PackageRepository";
import { Package } from "../entity/Package";
import { PackageVersionRepository } from "../repositories/PackageVersionRepository";
import { PackageVersion } from "../entity/PackageVersion";
import {
  ManifestRepository,
  ManifestVersionRepository,
} from "../repositories/ManifestRepository";
import { Manifest } from "../entity/Manifest";
import { ManifestVersion } from "../entity/ManifestVersion";

@Controller("/manifest")
export class ManifestsController {
  @Constant("swagger")
  swagger: SwaggerSettings[];

  constructor(private manifestRepository: ManifestRepository) {}

  @Get("/:name")
  @(Returns(200, String).ContentType("application/json"))
  async get(@PathParams("name") name: string) {
    const manifest = await this.manifestRepository.greedyFindByName(name)
    return manifest?.payload;
  }
}
