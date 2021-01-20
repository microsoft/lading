import { MaxLength, Property, Required } from "@tsed/schema";
import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from "typeorm";
import { PackageVersion } from "./PackageVersion";

@Entity()
export class Package {
  @PrimaryGeneratedColumn()
  @Property()
  id: number;

  @Column()
  @MaxLength(100)
  @Required()
  name: string;

  @OneToMany(() => PackageVersion, (pv) => pv.package)
  versions: PackageVersion[];

  get humanFriendlyName(): string {
    return this.name;
  }
}
