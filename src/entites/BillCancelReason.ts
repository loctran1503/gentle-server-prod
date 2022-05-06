import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,

  PrimaryGeneratedColumn,
} from "typeorm";
import { Customer } from "./Customer";


@ObjectType()
@Entity()
export class BillCancelReason extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;


  @Field()
  @Column()
  reason: string;

  @Field((_return) => Customer)
  @ManyToOne(() => Customer, (customer) => customer.billCancelReason)
  customer: Customer;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
