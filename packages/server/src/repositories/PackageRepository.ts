import { EntityRepository, Repository } from "typeorm";
import { Package } from "../entity/Package";

@EntityRepository(Package)
export class PackageRepository extends Repository<Package> {
  findByID(id: string): Promise<Package | undefined> {
    return this.findOne(id, { relations: ["versions"] });
  }
}
