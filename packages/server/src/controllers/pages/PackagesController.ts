import {
  Constant,
  Controller,
  Get,
  Post,
  HeaderParams,
  PathParams,
  BodyParams,
  View,
  Context,
} from "@tsed/common";
import { Hidden, SwaggerSettings } from "@tsed/swagger";
import { Returns } from "@tsed/schema";
import { PackageRepository } from "../../repositories/PackageRepository";
import { Package } from "../../entity/Package";
import { PackageVersionRepository } from "../../repositories/PackageVersionRepository";
import { PackageVersion } from "../../entity/PackageVersion";

@Hidden()
@Controller("/packages")
export class PackagesController {
  @Constant("swagger")
  swagger: SwaggerSettings[];

  constructor(
    private packageRepository: PackageRepository,
    private packageVersionRepository: PackageVersionRepository
  ) {}

  @Get("/")
  @View("packages/index.ejs")
  @(Returns(200, String).ContentType("text/html"))
  async get(
    @HeaderParams("x-forwarded-proto") _protocol: string,
    @HeaderParams("host") _host: string
  ) {
    const packages = await this.packageRepository.find();

    return {
      packages,
    };
  }

  @Post("/:packageId/versions")
  async createVersion(
    @PathParams("packageId") packageId: string,
    @BodyParams() payload: any,
    @Context() ctx: Context
  ) {
    const record = await this.packageRepository.findByID(packageId);
    const packageVersion = new PackageVersion();
    packageVersion.version = payload.version;
    packageVersion.cdnUrl = payload.cdnUrl;
    packageVersion.globalVarName = payload.globalVarName;
    if (record) {
      packageVersion.package = record;
    }
    await this.packageVersionRepository.save(packageVersion);
    return ctx.response.redirect(201, `/rest/packages/${packageId}`);
  }

  @Get("/new")
  @View("packages/new.ejs")
  @(Returns(200, String).ContentType("text/html"))
  async newForm() {
    return {};
  }

  @Get("/:packageId")
  @View("packages/show.ejs")
  @(Returns(200, String).ContentType("text/html"))
  async show(@PathParams("packageId") packageId: string) {
    const record = await this.packageRepository.findByID(packageId);

    return {
      record,
    };
  }

  @Post()
  async create(@BodyParams() payload: any, @Context() ctx: Context) {
    const packageObject = new Package();
    packageObject.name = payload.name;
    await this.packageRepository.save(packageObject);
    return ctx.response.redirect(201, `/rest/packages/${packageObject.id}`);
  }
}
