import { Body, ClassSerializerInterceptor, Controller, HttpCode, Post, Req, Res, UseGuards, UseInterceptors } from "@nestjs/common";
import { AuthenticationService } from "./authentication.service";
import { Response } from 'express';
import { RegisterDto } from "./dto/register.dto";
import RequestWithUser from "./requestWithUser.interface";
import { LocalAuthenticationGuard } from "./localAuthentication.guard";
import JwtAuthenticationGuard from "./jwt-authentication.guard";


@Controller('authentication')
@UseInterceptors(ClassSerializerInterceptor)
export class AuthenticationController{
    constructor(
        private readonly authenticationService: AuthenticationService
    ){}

    @Post('register')
    async register(@Body() registrationData: RegisterDto){
        return this.authenticationService.register(registrationData);
    }

    
    @HttpCode(200)
    @UseGuards(LocalAuthenticationGuard)
    @Post('log-in')
        async logIn(@Req() request: RequestWithUser) {
        const {user} = request;
        const cookie = this.authenticationService.getCookieWithJwtToken(user.id);
        request.res.setHeader('Set-Cookie', cookie);
        return user;
    }

    @UseGuards(JwtAuthenticationGuard)
    @Post('log-out')
    async logOut(@Req() request: RequestWithUser, @Res() response: Response) {
      response.setHeader('Set-Cookie', this.authenticationService.getCookieForLogOut());
      return response.sendStatus(200);
    }
}