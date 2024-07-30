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
import * as bcrypt from 'bcrypt';

describe("The AuthenticationService", () => {
    let authenticationService: AuthenticationService;
    let usersService: UsersService;
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
        usersService = await module.get(UsersService);
      })
      describe('when accessing the data of authenticating user', async () => {
        it('should attempt to get the user by email', () => {
          const getByEmailSpy = jest.spyOn(usersService, 'getByEmail');
          authenticationService.getAutheticatedUser('user@email.com', 'strongPassword');
          expect(getByEmailSpy).toBeCalledTimes(1);
        })
      })
      describe('The AuthenticationService', () => {
        let bcryptCompare: jest.Mock;
        beforeEach(async () => {
          bcryptCompare = jest.fn().mockReturnValue(true);
          (bcrypt.compare as jest.Mock) = bcryptCompare;
        });
      });

})