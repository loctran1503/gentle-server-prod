import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Product } from "./Product";


@ObjectType()
@Entity()
export class Country extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ unique: true }) 
  countryName: string;

  

  @Field((_return) => [Product], { nullable: true })
  @OneToMany(() => Product, (product) => product.country, { nullable: true })
  products?: Product[];
}
