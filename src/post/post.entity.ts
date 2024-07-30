import { Transform } from "class-transformer";
import Category from "src/category/category.entity";
import Comment from "src/comment/comment.entity";
import User from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, OneToMany, PrimaryGeneratedColumn } from "typeorm";

@Entity()
class PostEntity{
    @PrimaryGeneratedColumn()
    public id: number;

    @Column()
    public title: string;
    
    @Column()
    public content: string;

    @Column({ nullable: true })
    public category?: string;

    @ManyToOne(() => User, (author: User) => author.posts)
    public author: User;

    @ManyToMany(() => Category)
    @JoinTable()
    public categories: Category[];

    @OneToMany(() => Comment, (comment: Comment) => comment.post)
    public comments: Comment[];
}
export default PostEntity;