import { BillStatusType } from "../types/others/BillStatusType";
import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, ManyToOne, OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { BillProduct } from "./BillProduct";
import { Customer } from "./Customer";

import { User } from "./User";


@ObjectType()
@Entity()
export class Bill extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field({nullable:true})
  @Column({nullable:true})
  notice?: string;

  @Field()
  @Column()
  paymentType: string;

  @Field(_return => User,{nullable:true})
  @ManyToOne(() =>User,user => user.bills,{nullable:true})
  user?: User;

  @Field({nullable:true})
  @Column({nullable:true})
  introduceCode?: number;

  @Field()
  @Column()
  deliveryPrice: number;

  @Field({nullable:true})
  @Column({nullable:true})
  paymentDown:number

  @Field({defaultValue:true})
  @Column({default:true})
  isCommented: boolean;

  @Field({defaultValue:BillStatusType.COMFIRM_WAITING})
  @Column({
    type: 'enum',
    enum: BillStatusType,
    default: BillStatusType.COMFIRM_WAITING
  })
  billStatus:BillStatusType

  
  @Field(_return => Customer)
  @ManyToOne(() =>Customer,customer => customer.bills)
  customer: Customer;


  
  @Field(_return => [BillProduct])
  @OneToMany(() =>BillProduct,item => item.bill)
  billProducts: BillProduct[];


  @Field()
  @CreateDateColumn({type:"date"})
  createdAt: string;
}
