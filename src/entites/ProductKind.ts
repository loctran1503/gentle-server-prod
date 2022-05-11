import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity, OneToMany, PrimaryGeneratedColumn
} from "typeorm";

import { Country } from "./Country";
import { Product } from "./Product";
import { ProductClass } from "./ProductClass";



@ObjectType()
@Entity({name:"product_kind"})
export class ProductKind extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name: string;

  @Field(_return => [ProductClass],{nullable:true})
  @OneToMany(() =>ProductClass,item => item.kind,{nullable:true})
  productClasses?:ProductClass[]

  @Field(_return => [Product],{nullable:true})
  @OneToMany(() =>Product,product => product.kind,{nullable:true})
  products?: Product[];

  @Field(_return => [Country],{nullable:true})
  @OneToMany(() =>Country,countries => countries.kind,{nullable:true})
  countries?: Country[];

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
