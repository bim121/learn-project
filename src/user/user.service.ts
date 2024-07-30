import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import User from "./user.entity";
import { HttpException, HttpStatus, Injectable, UnauthorizedException } from "@nestjs/common";
import CreateUserDto from "./dto/createUser.dto";
import { FileService } from "src/files/files.service";
import { PrivateFilesService } from "src/privateFiles/privateFiles.service";

@Injectable()
export class UsersService{
    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>,
        private readonly filesService: FileService,
        private readonly privateFilesService: PrivateFilesService
    ) {}

    async getByEmail(email: string){
        const user = await this.userRepository.findOneBy({email});

        if(user){
            return user;
        }

        throw new HttpException("User with this email does not exist", HttpStatus.NOT_FOUND);
    }

    async create(userData: CreateUserDto){
        const newUser = await this.userRepository.create(userData);
        await this.userRepository.save(newUser);
        return newUser;
    }

    async getById(id: number) {
        const user = await this.userRepository.findOneBy({ id });
        if (user) {
          return user;
        }
        throw new HttpException('User with this id does not exist', HttpStatus.NOT_FOUND);
    }

    async addAvatar(userId: number, imageBuffer: Buffer, filename: string) {
        const avatar = await this.filesService.uploadPublicFile(imageBuffer, filename);
        const user = await this.getById(userId);
        await this.userRepository.update(userId, {
          ...user,
          avatar
        });
        return avatar;
    }

    async deleteAvatar(userId: number) {
        const user = await this.getById(userId);
        const fileId = user.avatar?.id;
        if (fileId) {
          await this.userRepository.update(userId, {
            ...user,
            avatar: null
          });
          await this.filesService.deletePublicFile(fileId)
        }
    }

    async addPrivateFile(userId: number, imageBuffer: Buffer, filename: string) {
        return this.privateFilesService.uploadPrivateFile(imageBuffer, userId, filename);
    }

    async getPrivateFile(userId: number, fileId: number) {
        const file = await this.privateFilesService.getPrivateFile(fileId);
        if (file.info.owner.id === userId) {
          return file;
        }
        throw new UnauthorizedException();
    }
}