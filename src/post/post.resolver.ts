import { Args, Context, Mutation, Query, Resolver } from '@nestjs/graphql';
import PostsService from './post.service';
import { Post } from './model/post.model';
import { UseGuards } from '@nestjs/common';
import { GraphqlJwtAuthGuard } from 'src/authentication/graphql-jwt-auth.guard';
import RequestWithUser from 'src/authentication/requestWithUser.interface';
import { CreatePostInput } from './inputs/post.input';
 
@Resolver(() => Post)
export class PostsResolver {
  constructor(
    private postsService: PostsService,
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
    return this.postsService.createPost(createPostInput, context.req.user);
  }
}