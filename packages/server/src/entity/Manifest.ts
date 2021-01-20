import { MaxLength, Property, Required } from "@tsed/schema";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { ManifestVersion } from "./ManifestVersion";

@Entity()
export class Manifest {
  @PrimaryGeneratedColumn()
  @Property()
  id: number;

  @Column()
  @MaxLength(100)
  @Required()
  name: string;

  @OneToMany(() => ManifestVersion, (mv) => mv.manifest)
  manifestVersions: ManifestVersion[];

  get humanFriendlyName(): string {
    return this.name;
  }

  get payload(): any {
    if (this.manifestVersions === null || this.manifestVersions === undefined) {
      return { err: "Data not loaded"}
    }

    return {
      name: this.name,
      packages: this.manifestVersions.map(x => x.payload)
    }
  }
}
