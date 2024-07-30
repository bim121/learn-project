
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivateFilesService } from './privateFiles.service';
import { ConfigModule } from '@nestjs/config';
import PrivateFile from './privateFiles.entity';
 
@Module({
  imports: [
    TypeOrmModule.forFeature([PrivateFile]),
    ConfigModule,
  ],
  providers: [PrivateFilesService],
  exports: [PrivateFilesService]
})
export class PrivateFilesModule {}