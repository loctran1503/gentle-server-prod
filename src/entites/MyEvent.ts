import { Field, ObjectType } from "type-graphql";
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@ObjectType()
@Entity()
export class MyEvent extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  title: string;

  @Field()
  @Column()
  content: string;

  @Field()
  @Column()
  thumbnail: string;

  @Field(_type => [String],{nullable:true})
  @Column( {type:"simple-array",nullable:true})
  instructionImages?: string[];

  @Field()
  @Column()
  summary: string;

  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
