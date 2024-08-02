import { Module } from "@nestjs/common";
import PostsController from "./post.controller";
import PostsService from "./post.service";
import { CacheModule } from '@nestjs/cache-manager';
import { TypeOrmModule } from "@nestjs/typeorm";
import PostEntity from "./post.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([PostEntity]),
        CacheModule.register()
    ],
    controllers: [PostsController],
    providers: [PostsService],
})
export class PostsModule{}