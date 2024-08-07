import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { InjectRepository } from '@nestjs/typeorm';
import Comment from '../../comment.entity';
import { Repository } from 'typeorm';
import { GetCommentsQuery } from '../implementation/getComments.query';

@QueryHandler(GetCommentsQuery)
export class GetCommentsHandler implements IQueryHandler<GetCommentsQuery> {
  constructor(
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
  ) {}

  async execute(query: GetCommentsQuery) {
    if (query.postId) {
      return this.commentsRepository.find();
    }
    return this.commentsRepository.find();
  }
}