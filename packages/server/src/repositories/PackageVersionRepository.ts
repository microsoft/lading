import {EntityRepository, Repository} from "typeorm";
import {PackageVersion} from "../entity/PackageVersion";

@EntityRepository(PackageVersion)
export class PackageVersionRepository extends Repository<PackageVersion> {
  findByID(id: string): Promise<PackageVersion | undefined> {
    return this.findOne(id);
  }
}