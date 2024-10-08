import { UsersService } from "src/user/user.service";
import * as bcrypt from 'bcrypt';
import { HttpException, HttpStatus } from "@nestjs/common";
import { PostgresErrorCode } from "src/database/postgresErrorCode.enum";
import { RegisterDto } from "./dto/register.dto";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import TokenPayload from "./tokenPayload.interface";

export class AuthenticationService{
    constructor(
        private readonly usersService: UsersService,
        private readonly jwtService: JwtService,
        private readonly configService: ConfigService
    ){}

    public async register(registrationData: RegisterDto){
        const hashedPassword = await bcrypt.hash(registrationData.password, 10);

        try{
            const createdUser = await this.usersService.create({
                ...registrationData,
                password: hashedPassword
            })

            createdUser.password = undefined;

            return createdUser;
        } catch (error){
            if(error?.code === PostgresErrorCode.UniqueViolation){
                throw new HttpException('User with that email already exists', HttpStatus.BAD_REQUEST);
            }
            throw new HttpException('Something went wrong', HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    public async getAutheticatedUser(email: string, hashedPassword: string){
        try{
            const user = await this.usersService.getByEmail(email);
            await this.verifyPassword(user.password, hashedPassword);
            user.password = undefined;
            return user;
        } catch (error){
            throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST);
        }
    }

    public async verifyPassword(plainTextPassword: string, hashedPassword: string){
        const isPasswordMathing = await bcrypt.compare(
            hashedPassword, 
            plainTextPassword
        );

        if(!isPasswordMathing){
            throw new HttpException("Wrong credentials provided", HttpStatus.BAD_REQUEST);
        }
    }

    public getCookieWithJwtToken(userId: number){
        const payload: TokenPayload = {userId};
        const token = this.jwtService.sign(payload);
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_EXPIRATION_TIME')}`;
    }

    public getCookieForLogOut() {
        return `Authentication=; HttpOnly; Path=/; Max-Age=0`;
    }

    public getCookieWithJwtAccessToken(userId: number, isSecondFactorAuthenticated = false) {
        const payload: TokenPayload = { userId, isSecondFactorAuthenticated };
        const token = this.jwtService.sign(payload, {
          secret: this.configService.get('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: `${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}s`
        });
        return `Authentication=${token}; HttpOnly; Path=/; Max-Age=${this.configService.get('JWT_ACCESS_TOKEN_EXPIRATION_TIME')}`;
      }
}