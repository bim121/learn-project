import { Transform } from "class-transformer";
import Category from "src/category/category.entity";
import User from "src/user/user.entity";
import { Column, Entity, JoinTable, ManyToMany, ManyToOne, PrimaryGeneratedColumn } from "typeorm";

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
}
export default PostEntity;