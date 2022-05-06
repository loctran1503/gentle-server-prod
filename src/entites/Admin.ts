import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column,
    CreateDateColumn,
    Entity, OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Feedback } from "./Feedback";


@ObjectType()
@Entity()
export class Admin extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({unique:true})
  adminId: string;

  @Field()
  @Column()
  adminName: string;

  @Field()
  @Column()
  avatar: string;

  
  @Field({nullable:true})
  @Column({nullable:true})
  adminType?: string;


  
  @Field(_return => [Feedback])
  @OneToMany(() =>Feedback,feedback => feedback.admin)
  feedbacks: Feedback[];


  @Field()
  @CreateDateColumn()
  createdAt: Date;
}
