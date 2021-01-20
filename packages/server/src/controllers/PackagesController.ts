import {BodyParams, Controller, Get, Post} from "@tsed/common";
import {Package} from "../entity/Package";
import { PackageRepository } from "../repositories/PackageRepository";
import {PackageService} from "../services/PackageService";

@Controller("/api/packages")
export class PackagesController {
  constructor(private packageRepository: PackageRepository) {
  }

  /*@Post("/")
  create(@BodyParams() package: Package): Promise<Package> {
    return this.packageRepository.create(package);
  }*/

  @Get("/")
  getList(): Promise<Package[]> {
    return this.packageRepository.find();
  }
}
