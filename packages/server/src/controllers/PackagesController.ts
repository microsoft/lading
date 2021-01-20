import { Controller, Get } from "@tsed/common";
import { Package } from "../entity/Package";
import { PackageRepository } from "../repositories/PackageRepository";

@Controller("/api/packages")
export class PackagesController {
  constructor(private packageRepository: PackageRepository) {}

  /*@Post("/")
  create(@BodyParams() package: Package): Promise<Package> {
    return this.packageRepository.create(package);
  }*/

  @Get("/")
  getList() {
    return this.packageRepository.find();
  }
}
