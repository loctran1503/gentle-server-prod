import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { User } from "./User";


@ObjectType()
@Entity()
export class TakeMoneyField
 extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({unique:true})
  accoutName: string;

  @Field()
  @Column()
  accountNumber: string;

  @Field()
  @Column()
  accountBankName: string;

  @Field({nullable:true})
  @Column({nullable:true})
  cancelReason?: string;

  @Field()
  @Column()
  money:number

  @Field({nullable:true})
  @Column({nullable:true})
  isSuccessImage?:string


  @Field({defaultValue:""})
  @Column({default:""})
  status: string;

  
  @Field(_return => User)
  @ManyToOne(() =>User,user => user.takeMoneyField)
  user: User;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
 
}
