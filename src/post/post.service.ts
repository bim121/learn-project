import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { FindManyOptions, MoreThan, Repository } from "typeorm";
import PostEntity from "./post.entity";
import { UpdatePostDto } from "./dto/updatePost.dto";
import User from "src/user/user.entity";
import { PostNotFoundException } from "./exception/postNotFound.exception";
import { CACHE_MANAGER } from "@nestjs/cache-manager";
import CreatePostDto from "./dto/createPost.dto";

@Injectable()
export default class PostsService{
    constructor(
        @InjectRepository(PostEntity)
        private postsRepository: Repository<PostEntity>,
        @Inject(CACHE_MANAGER) private cacheManager
    ) {}

    
    private readonly GET_POSTS_CACHE_KEY = 'GET_POSTS_CACHE';

    async clearCache() {
        const keys: string[] = await this.cacheManager.store.keys();
        keys.forEach((key) => {
          if (key.startsWith(this.GET_POSTS_CACHE_KEY)) {
            this.cacheManager.del(key);
          }
        })
    }

    async getAllPosts(offset?: number, limit?: number, startId?: number) {
        const where: FindManyOptions<PostEntity>['where'] = {};
        let separateCount = 0;
        if (startId) {
          where.id = MoreThan(startId);
          separateCount = await this.postsRepository.count();
        }
    
        const [items, count] = await this.postsRepository.findAndCount({
          where,
          relations: ['author'],
          order: {
            id: 'ASC'
          },
          skip: offset,
          take: limit
        });
    
        return {
          items,
          count: startId ? separateCount : count
        }
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
            await this.clearCache();
            return updatedPost
        }
        throw new PostNotFoundException(id);
    }

    async createPost(post: CreatePostDto, user: User) {
        const newPost = await this.postsRepository.create({
          ...post,
          author: user
        });
        await this.postsRepository.save(newPost);
        await this.clearCache();
        return newPost;
      }

    public async deletePost(id: number) {
        await this.clearCache();
        const deleteResponse = await this.postsRepository.delete(id);
        if (!deleteResponse.affected) {
          throw new HttpException('Post not found', HttpStatus.NOT_FOUND);
        }
    }
}