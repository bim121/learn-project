import { HttpException, HttpStatus, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import PostEntity from "./post.entity";
import { UpdatePostDto } from "./dto/updatePost.dto";
import User from "src/user/user.entity";
import { PostNotFoundException } from "./exception/postNotFound.exception";

@Injectable()
export default class PostsService{
    constructor(
        @InjectRepository(PostEntity)
        private postsRepository: Repository<PostEntity>
    ) {}

    public getAllPosts(){
        return this.postsRepository.find({ relations: ['author'] });
    }

    public async getPostById(id: number){
        const post = await this.postsRepository.findOne({ where: { id }, relations: ['author'] });
        if (post) {
            return post;
        }
        throw new PostNotFoundException(id);
    }

    public async updatePost(id: number, post: UpdatePostDto) {
        await this.postsRepository.update(id, post);
        const updatedPost = await this.postsRepository.findOne({ where: { id }, relations: ['author'] });
        if (updatedPost) {
            return updatedPost
        }
        throw new PostNotFoundException(id);
    }

    public async createPost(post: CreatePostDto, user: User) {
        const newPost = await this.postsRepository.create({
            ...post,
            author: user
        });
        await this.postsRepository.save(newPost);
        return newPost;
    }

    public async deletePost(id: number) {
        const deleteResponse = await this.postsRepository.delete(id);
        if (!deleteResponse.affected) {
          throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
    }
}