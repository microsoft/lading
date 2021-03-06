import { MaxLength, Property, Required } from "@tsed/schema";
import {
  Column,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { ManifestVersion } from "./ManifestVersion";
import { Package } from "./Package";

@Entity()
export class PackageVersion {
  @PrimaryGeneratedColumn()
  @Property()
  id: number;

  @Column()
  @MaxLength(100)
  @Required()
  version: string;

  @Column()
  @MaxLength(1024)
  @Required()
  cdnUrl: string;

  @Column({ default: ""})
  @MaxLength(1024)
  @Required()
  globalVarName: string;

  @Column("simple-json", {nullable: true})
  metadata: any;

  @ManyToOne(() => Package, (packageEntity) => packageEntity.versions)
  package: Package;

  @OneToMany(() => ManifestVersion, (mv) => mv.packageVersion)
  manifestVersions: ManifestVersion[];

  get packageName(): string | undefined {
    return this.package?.name;
  }
}
