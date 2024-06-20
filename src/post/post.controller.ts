import { Body, Controller, Delete, Get, Param, Post, Put, Req, UseGuards } from "@nestjs/common";
import PostsService from "./post.service";
import JwtAuthenticationGuard from "src/authentication/jwt-authentication.guard";
import { FindOneParams } from "src/utils/findOneParams";
import { UpdatePostDto } from "./dto/updatePost.dto";
import RequestWithUser from "src/authentication/requestWithUser.interface";

@Controller('posts')
export default class PostsController{
    constructor(
        private readonly postsService: PostsService
    ) {}

    @Get()
    getAllPosts(){
        return this.postsService.getAllPosts();
    }

    @Get(':id')
    getPostById(@Param('id') id: string){
        return this.postsService.getPostById(Number(id));
    }

    @Post()
    @UseGuards(JwtAuthenticationGuard)
    async createPost(@Body() post: CreatePostDto, @Req() req: RequestWithUser){
        return this.postsService.createPost(post, req.user);
    }

    @Put(':id')
    async replacePost(@Param('id') id: FindOneParams, @Body() post: UpdatePostDto){
        return this.postsService.updatePost(Number(id), post);
    }

    @Delete(':id')
    async deletePost(@Param('id') id: FindOneParams){
        this.postsService.deletePost(Number(id));
    }
}