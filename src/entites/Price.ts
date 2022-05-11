import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
} from "typeorm";

import { Product } from "./Product";

@ObjectType()
@Entity()
export class Price extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  type!: string;

  @Field()
  @Column()
  price!: number;

  @Field({defaultValue:0})
  @Column({default:0})
  salesPercent: number;

  @Field()
  @Column()
  status!: number;

  @Field({ nullable: true })
  @Column({ nullable: true })
  isGift?: boolean;

  @Field((_type) => Product)
  @ManyToOne(() => Product, (product) => product.prices)
  product: Product;
}
