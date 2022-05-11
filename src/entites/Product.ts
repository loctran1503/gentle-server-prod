import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Brand } from "./Brand";
import { Country } from "./Country";
import { Price } from "./Price";
import { ProductClass } from "./ProductClass";
import { ProductKind } from "./ProductKind";
import { UserComment } from "./UserComment";

@ObjectType()
@Entity()
export class Product extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  productName!: string;

  @Field()
  @Column()
  thumbnail!: string;

  @Field((_return) => [String])
  @Column("simple-array")
  imgDescription!: string[];

  @Field()
  @Column()
  description!: string;

  @Field({defaultValue:0})
  @Column({default:0})
  salesPercent:number

  //Giá hiển thị là một trong prices
  @Field()
  @Column()
  priceToDisplay!: number;

  //Số sp đã bán
  @Field({defaultValue:0})
  @Column({default:0})
  sales: number;

  @Field((_return) => [Price])
  @OneToMany(() => Price, (price) => price.product)
  prices!: Price[];

  @Field((_return) => [UserComment], { nullable: true })
  @OneToMany(() => UserComment, (comment) => comment.product, {
    nullable: true,
  })
  comments?: UserComment[];

 
  @Field(_return => Brand)
  @ManyToOne(() => Brand, (brand) => brand.products)
  brand!: Brand;

  @Field(_return => ProductKind)
  @ManyToOne(() => ProductKind,kind => kind.products,)
  kind:ProductKind

  @Field(_return => ProductClass)
  @ManyToOne(() => ProductClass,item => item.products)
  class:ProductClass

  @Field(_return => Country)
  @ManyToOne(() =>Country,country => country.products)
  country: Country;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
