
import { Controller, Delete, Get, Param, Post, Req, Res, UploadedFile, UseGuards, UseInterceptors } from '@nestjs/common';
import JwtAuthenticationGuard from '../authentication/jwt-authentication.guard';
import RequestWithUser from '../authentication/requestWithUser.interface';
import { FileInterceptor } from '@nestjs/platform-express';
import { Express } from 'express';
import { UsersService } from './user.service';
import { FindOneParams } from 'src/utils/findOneParams';
 
@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
  ) {}
 
  @Post('avatar')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addAvatar(@Req() request: RequestWithUser, @UploadedFile() file: any) {
    return this.usersService.addAvatar(request.user.id, file.buffer, file.originalname);
  }

  @Delete('avatar/:id')
  @UseGuards(JwtAuthenticationGuard)
  async deleteAvatar(@Param('id') fileId: number) {
    return this.usersService.deleteAvatar(fileId);
  }

  @Post('files')
  @UseGuards(JwtAuthenticationGuard)
  @UseInterceptors(FileInterceptor('file'))
  async addPrivateFile(@Req() request: RequestWithUser, @UploadedFile() file: any) {
    return this.usersService.addPrivateFile(request.user.id, file.buffer, file.originalname);
  }

  @Get('files/:id')
  @UseGuards(JwtAuthenticationGuard)
  async getPrivateFile(
    @Req() request: RequestWithUser,
    @Param() { id }: FindOneParams,
    @Res() res: any
  ) {
    const file = await this.usersService.getPrivateFile(request.user.id, Number(id));
    file.stream.pipe(res)
  }
}