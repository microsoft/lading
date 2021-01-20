import {
  Constant,
  Controller,
  Get,
  Post,
  PathParams,
  BodyParams,
  View,
  Context,
} from "@tsed/common";
import { Hidden, SwaggerSettings } from "@tsed/swagger";
import { Returns } from "@tsed/schema";
import { PackageRepository } from "../../repositories/PackageRepository";
import {
  ManifestRepository,
  ManifestVersionRepository,
} from "../../repositories/ManifestRepository";
import { Manifest } from "../../entity/Manifest";
import { ManifestVersion } from "../../entity/ManifestVersion";

@Hidden()
@Controller("/manifests")
export class ManifestsController {
  @Constant("swagger")
  swagger: SwaggerSettings[];

  constructor(
    private manifestRepository: ManifestRepository,
    private packageRepository: PackageRepository,
    private manifestVersionRepository: ManifestVersionRepository
  ) {}

  @Get("/")
  @View("manifests/index.ejs")
  @(Returns(200, String).ContentType("text/html"))
  async get() {
    const manifests = await this.manifestRepository.find();
    return {
      manifests,
    };
  }

  @Get("/new")
  @View("manifests/new.ejs")
  @(Returns(200, String).ContentType("text/html"))
  async newForm() {
    return {};
  }

  @Get("/:manifestId")
  @View("manifests/show.ejs")
  @(Returns(200, String).ContentType("text/html"))
  async show(@PathParams("manifestId") manifestId: string) {
    const record = await this.manifestRepository.greedyFind(
      parseInt(manifestId, 10)
    );
    return {
      record,
    };
  }

  @Post("/:manifestId/packages")
  async createVersion(
    @PathParams("manifestId") manifestId: string,
    @BodyParams() payload: any,
    @Context() ctx: Context
  ) {
    const packageRecord = await this.packageRepository.findOne(
      { name: payload.package },
      { relations: ["versions"] }
    );
    const manifest = await this.manifestRepository.greedyFind(
      parseInt(manifestId, 10)
    );
    if (packageRecord && manifest) {
      const packageVersion = packageRecord.versions.find(
        (v) => v.version === payload.version
      );
      if (packageVersion) {
        const manifestVersion =
          manifest.manifestVersions.find(
            (mv) => mv.packageName === payload.package
          ) || new ManifestVersion();
        manifestVersion.packageVersion = packageVersion;
        manifestVersion.manifest = manifest;
        await this.manifestVersionRepository.save(manifestVersion);
      }
    }
    return ctx.response.redirect(201, `/rest/manifests/${manifestId}`);
  }

  @Post()
  async create(@BodyParams() payload: any, @Context() ctx: Context) {
    const manifest = new Manifest();
    manifest.name = payload.name;
    await this.manifestRepository.save(manifest);
    return ctx.response.redirect(201, `/rest/manifests/${manifest.id}`);
  }
}
