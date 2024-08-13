import { Args, Context, Mutation, Parent, Query, ResolveField, Resolver, Subscription } from '@nestjs/graphql';
import PostsService from './post.service';
import { Post } from './model/post.model';
import { Inject, UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from 'src/authentication/graphql-jwt-auth.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { CreatePostInput } from './inputs/post.input';
import User from 'src/user/user.entity';
import { UsersService } from 'src/user/user.service';
import { PUB_SUB } from 'src/pubSub/pubSub.module';
import { RedisPubSub } from 'graphql-redis-subscriptions';
 
const POST_ADDED_EVENT = 'postAdded';

@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
    @Inject(PUB_SUB) private pubSub: RedisPubSub,
    private usersService: UsersService,
  ) {}
 
  @Query(() => [Post])
  async posts() {
    const posts = await this.postsService.getAllPosts();
    return posts.items;
  }

  @Mutation(() => Post)
  @UseGuards(GraphqlJwtAuthGuard)
  async createPost(
    @Args('input') createPostInput: CreatePostInput,
    @Context() context: { req: RequestWithUser },
  ) {
    const newPost = this.postsService.createPost(createPostInput, context.req.user);
    this.pubSub.publish(POST_ADDED_EVENT, { postAdded: newPost });
    return newPost;
  }

  @ResolveField('author', () => User)
  async getAuthor(@Parent() post: Post) {
    const { authorId } = post;
 
    return this.usersService.getById(authorId);
  }

  @Subscription(() => Post)
  postAdded() {
    return this.pubSub.asyncIterator(POST_ADDED_EVENT);
  }
}