import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
     ManyToMany,
     ManyToOne,
     OneToMany, PrimaryGeneratedColumn
} from "typeorm";
import { Brand } from "./Brand";
import { Product } from "./Product";
import { ProductKind } from "./ProductKind";


@ObjectType()
@Entity()
export class ProductClass extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  name: string;

  @Field(_return => [Product],{nullable:true})
  @OneToMany(() =>Product,product => product.class,{nullable:true})
  products?: Product[];

  @Field(_return => ProductKind)
  @ManyToOne(() => ProductKind,item => item.productClasses)
  kind:ProductKind

  @Field(_return => [Brand])
  @ManyToMany(() => Brand,item => item.productClasses)
  brands:Brand[]

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
