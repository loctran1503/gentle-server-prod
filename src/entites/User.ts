import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
} from "typeorm";
import { Bill } from "./Bill";
import { MoneyBonus } from "./MoneyBonus";
import { TakeMoneyField } from "./TakeMoneyField";
import { UserComment } from "./UserComment";

@ObjectType()
@Entity()
export class User extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Column({ unique: true })
  userId!: string;


  @Field()
  @Column()
  userAvatar!: string;

  @Field()
  @Column()
  userName!: string;

  @Field()
  @Column()
  introduceCode: number;

  @Field({defaultValue:0})
  @Column({default:0})
  paidAmount?:number

  @Field({defaultValue:false})
  @Column({default:false})
  isHidden:boolean

  @Field({defaultValue:0})
  @Column({default:0})
  moneyDepot:number

  @Field(_return => [Bill],{nullable:true})
  @OneToMany(() =>Bill,bill => bill.user,{nullable:true})
  bills?: Bill[];

  @Field(_return => [MoneyBonus],{nullable:true})
  @OneToMany(() => MoneyBonus,item => item.user,{nullable:true})
  moneyBonuses?:MoneyBonus[]

  @Field(_return => [TakeMoneyField],{nullable:true})
  @OneToMany(() => TakeMoneyField,item => item.user,{nullable:true})
  takeMoneyField?:TakeMoneyField[]

  @Field(_return => [UserComment],{nullable:true})
  @OneToMany(() => UserComment,item => item.user,{nullable:true})
  comments?:UserComment[]

  @Field()
  @CreateDateColumn({type:"date"})
  createdAt: string;
}
