import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column, Entity, JoinTable, ManyToMany, OneToMany,
  PrimaryGeneratedColumn
} from "typeorm";
import { Product } from "./Product";
import { ProductClass } from "./ProductClass";



@ObjectType()
@Entity({
  orderBy:{
    brandName:"ASC"
  }
})
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

  @Field({nullable:true})
  @Column({nullable:true})
  description?: string;

  
  

  @Field(_return => [ProductClass])
  @ManyToMany(() => ProductClass)
  @JoinTable()
  productClasses:ProductClass[]
  
  @Field(_return => [Product],{nullable:true})
  @OneToMany(() =>Product,product => product.brand,{nullable:true})
  products?: Product[];


 
}
