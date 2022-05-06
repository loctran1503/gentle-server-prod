import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Product } from "./Product";
import { ProductClass } from "./ProductClass";
import { ProductKind } from "./ProductKind";


@ObjectType()
@Entity()
export class Brand
 extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({unique:true})
  brandName: string;

  @Field()
  @Column()
  thumbnail: string;

  @Field()
  @Column()
  description: string;

  
  @Field(_return => ProductKind)
  @ManyToOne(() => ProductKind,kind => kind.brands)
  kind:ProductKind

  @Field(_return => [ProductClass])
  @ManyToMany(() => ProductClass)
  @JoinTable()
  productClasses:ProductClass[]
  
  @Field(_return => [Product],{nullable:true})
  @OneToMany(() =>Product,product => product.brand,{nullable:true})
  products?: Product[];


 
}
