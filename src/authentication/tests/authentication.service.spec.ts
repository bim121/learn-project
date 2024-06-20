import { UsersService } from "src/user/user.service";
import { AuthenticationService } from "../authentication.service"
import { Repository } from "typeorm";
import User from "src/user/user.entity";
import { JwtService } from "@nestjs/jwt";
import { ConfigService } from "@nestjs/config";
import { Test } from "@nestjs/testing";
import { getRepositoryToken } from "@nestjs/typeorm";
import { mockedJwtService } from "src/utils/mocks/jwt.service";
import { mockedConfigService } from "src/utils/mocks/config.service";


describe("The AuthenticationService", () => {
    let authenticationService: AuthenticationService;
    beforeEach(async () => {
        const module = await Test.createTestingModule({
          providers: [
            UsersService,
            AuthenticationService,
            {
              provide: ConfigService,
              useValue: mockedConfigService
            },
            {
              provide: JwtService,
              useValue: mockedJwtService
            },
            {
              provide: getRepositoryToken(User),
              useValue: {}
            }
          ],
        })
          .compile();
        authenticationService = await module.get(AuthenticationService);
      })
      describe('when creating a cookie', () => {
        it('should return a string', () => {
          const userId = 1;
          expect(
            typeof authenticationService.getCookieWithJwtToken(userId)
          ).toEqual('string')
        })
      })
})