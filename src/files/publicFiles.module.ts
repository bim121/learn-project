
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import PublicFile from './publicFile.entity';
import { FileService } from './files.service';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([PublicFile]),
    ConfigModule,
  ],
  providers: [FileService],
  exports: [FileService]
})
export class PublicFilesModule {}