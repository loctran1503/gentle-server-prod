
import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
 
  PrimaryGeneratedColumn,
} from "typeorm";

import { User } from "./User";

@ObjectType()
@Entity()
export class MoneyBonus extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ type: "bigint" })
  moneyNumber: number;

  @Field()
  @Column()
  description: string;

  

  @Field((_return) =>User)
  @ManyToOne(() => User, (user) => user.moneyBonuses)
  user: User;

  @Field()
  @CreateDateColumn({type:"timestamp with time zone"})
  createdAt: Date;
}
