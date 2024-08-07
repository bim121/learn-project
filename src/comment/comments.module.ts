import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import Comment from './comment.entity';
import CommentsController from './comments.controller';
import { CqrsModule } from '@nestjs/cqrs';
import { CreateCommentHandler } from './commands/handlers/createCommand.handler';
 
@Module({
  imports: [TypeOrmModule.forFeature([Comment]), CqrsModule],
  controllers: [CommentsController],
  providers: [CreateCommentHandler],
})
export class CommentsModule {}