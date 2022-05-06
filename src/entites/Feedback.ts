import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity,
    ManyToOne, PrimaryGeneratedColumn
} from "typeorm";
import { Admin } from "./Admin";
import { UserComment } from "./UserComment";

@ObjectType()
@Entity()
export class Feedback extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

 

  @Field()
  @Column()
  content!: string;

  @Field(_return => Admin)
  @ManyToOne(() =>Admin,admin => admin.feedbacks)
  admin: Admin;

  
  @Field(_return => [UserComment])
  @ManyToOne(() =>UserComment,comment => comment.feedbacks)
  comment: UserComment;


  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
