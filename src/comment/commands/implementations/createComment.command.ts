import CreateCommentDto from "src/comment/dto/createComment.dto";
import User from "src/user/user.entity";


export class CreateCommentCommand {
  constructor(
    public readonly comment: CreateCommentDto,
    public readonly author: User,
  ) {}

  
}