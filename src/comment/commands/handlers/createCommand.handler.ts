import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateCommentCommand } from './createComment.command';
import Comment from '../../comment.entity';
 
@CommandHandler(CreateCommentCommand)
export class CreateCommentHandler implements ICommandHandler<CreateCommentCommand> {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}
 
  async execute(command: CreateCommentCommand) {
    const newPost = await this.commentsRepository.create({
      ...command.comment,
      author: command.author
    });
    await this.commentsRepository.save(newPost);
    return newPost;
  }
}