import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bill } from "./Bill";
import { BillCancelReason } from "./BillCancelReason";

@ObjectType()
@Entity()
export class Customer extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  customerName: string;

  @Field()
  @Column()
  customerPhone: string;

  @Field()
  @Column()
  city: string;

  @Field()
  @Column()
  province: string;
 
  @Field()
  @Column()
  address: string;

  @Field({defaultValue:0})
  @Column({default:0})
  rejectedAmount: number;

  @Field((_return) => [Bill])
  @OneToMany(() => Bill, (bill) => bill.customer)
  bills?: Bill[];

  @Field((_return) => [BillCancelReason],{nullable:true})
  @OneToMany(() => BillCancelReason, (bill) => bill.customer,{nullable:true})
  billCancelReason?: BillCancelReason[];
}
