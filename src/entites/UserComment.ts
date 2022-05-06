import { Field, ObjectType } from "type-graphql";
import {
    BaseEntity,
    Column, CreateDateColumn, Entity,
    ManyToOne,
    OneToMany,
    PrimaryGeneratedColumn
} from "typeorm";
import { Feedback } from "./Feedback";
import { Product } from "./Product";
import { User } from "./User";

@ObjectType()
@Entity()
export class UserComment extends BaseEntity {
  @Field()
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column()
  content:string


  @Field()
  @Column()
  rating:number


  @Field({defaultValue:false})
  @Column({default:false})
  isFeedback:boolean



  @Field((_return) => [String],{nullable:true})
  @Column("simple-array",{nullable:true})
  imagesComment: string[];

  @Field(_type => [Feedback],{nullable:true})
  @OneToMany(() => Feedback,feedback => feedback.comment,{nullable:true})
  feedbacks?:Feedback[]

  @Field(_type => User)
  @ManyToOne(() => User,user => user.comments)
  user:User

  @Field()
  @ManyToOne(() => Product, (product) => product.comments)
  product: Product;

  @Field()
  @CreateDateColumn()
  createdAt: Date;

}
