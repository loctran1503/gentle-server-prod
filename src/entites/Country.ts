import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    Entity, ManyToOne, OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Product } from "./Product";
import { ProductKind } from "./ProductKind";

@ObjectType()
@Entity()
export class Country extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true })
  countryName: string;

  @Field((_return) => [ProductKind], { nullable: true })
  @ManyToOne(() => ProductKind,kind => kind.countries,  { nullable: true })
  kind?: ProductKind[];

  @Field((_return) => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.country, { nullable: true })
  products?: Product[];
}
