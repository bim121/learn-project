
import { Post } from '@nestjs/common';
import PostEntity from 'src/post/post.entity';
import User from 'src/user/user.entity';
import { Column, Entity, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';

@Entity()
class Comment {
  @PrimaryGeneratedColumn()
  public id: number;
 
  @Column()
  public content: string;
 
  @ManyToOne(() => Post, (post: PostEntity) => post.comments)
  public post: PostEntity;
 
  @ManyToOne(() => User, (author: User) => author.posts)
  public author: User;
}

export default Comment;