import { EntityRepository, Repository } from "typeorm";
import { Manifest } from "../entity/Manifest";
import { ManifestVersion } from "../entity/ManifestVersion";

@EntityRepository(Manifest)
export class ManifestRepository extends Repository<Manifest> {
  greedyFindByName(name: string): Promise<Manifest | undefined> {
    const opts = { relations: ["manifestVersions", "manifestVersions.packageVersion", "manifestVersions.packageVersion.package"] }
    return this.findOne({ name }, opts);
  }
  greedyFind(id: number): Promise<Manifest | undefined> {
    const opts = { relations: ["manifestVersions", "manifestVersions.packageVersion", "manifestVersions.packageVersion.package"] }
    return this.findOne(id, opts);
  }
}

@EntityRepository(ManifestVersion)
export class ManifestVersionRepository extends Repository<ManifestVersion> {}
