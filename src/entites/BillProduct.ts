import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { Bill } from "./Bill";


@ObjectType()
@Entity()
export class BillProduct
 extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  productName: string;

  @Field()
  @Column()
  productThumbnail: string;

  @Field()
  @Column()
  productType: string;

  @Field()
  @Column()
  productPrice: number;

  @Field()
  @Column()
  productAmount: number;

  @Column({nullable:true})
  @Field({nullable:true})
  priceIdForLocal?: number;

  @Column({nullable:true})
  @Field({nullable:true})
  countryNameForDeliveryPrice?: string;

  @Field(_return => Bill)
  @ManyToOne(() =>Bill,item => item.billProducts)
  bill: Bill;

  
 


 
}
