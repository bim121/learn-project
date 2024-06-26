import { Test } from "@nestjs/testing";
import { UsersService } from "../user.service"
import { getRepositoryToken } from "@nestjs/typeorm";
import User from "../user.entity";


describe('The UsersService', () => {
    let usersService: UsersService;
    let findOne: jest.Mock;

    beforeEach(async() => {
        findOne = jest.fn();
        const module = await Test.createTestingModule({
            providers: [
                UsersService,
                {
                    provide: getRepositoryToken(User),
                    useValue: {
                        findOne
                    }
                }
            ],
        })
            .compile()
        usersService = await module.get(UsersService);
    })
    describe('when getting a user by email', () => {
        describe('and the user is matched', () => {
            let user: User;
            beforeEach(() => {
                user = new User();
                findOne.mockReturnValue(Promise.resolve(user));
            }),
            it('should return the user', async () => {
                const fetchedUser = await usersService.getByEmail('test@test.com');
                expect(fetchedUser).toEqual(user);
            })
        })
        describe('amd the user is not matched', async () => {
            it('should throw an error', async () => {
                findOne.mockReturnValue(null);
                await expect(usersService.getByEmail('test@test.com')).rejects.toThrow();
            });
        })
    })
})