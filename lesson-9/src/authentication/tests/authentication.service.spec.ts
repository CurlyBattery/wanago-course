import { AuthenticationService } from '../authentication.service';
import { UsersService } from '../../users/users.service';
import { UserEntity } from '../../users/entities/user.entity';
import { Test } from '@nestjs/testing';
import { ConfigService } from '@nestjs/config';
import { mockedConfigService } from '../../utils/mocks/config.service';
import { JwtService } from '@nestjs/jwt';
import { mockedJwtService } from '../../utils/mocks/jwt.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { mockedUser } from '../../utils/mocks/user';
import * as bcrypt from 'bcrypt';

jest.mock('bcrypt');
const mockUserRepository = {
  findOne: jest.fn(),
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
};

describe('The Authentication Service', () => {
  let authenticationService: AuthenticationService;
  let usersService: UsersService;
  let userData: UserEntity;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [
        UsersService,
        AuthenticationService,
        {
          provide: ConfigService,
          useValue: mockedConfigService,
        },
        {
          provide: JwtService,
          useValue: mockedJwtService,
        },
        {
          provide: getRepositoryToken(UserEntity),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    authenticationService = module.get(AuthenticationService);
    usersService = module.get(UsersService);

    userData = { ...mockedUser };
    mockUserRepository.findOne.mockResolvedValue(userData);
  });

  describe('when accessing the data of authenticating user', () => {
    it('should throw if password invalid', async () => {
      (bcrypt.compareSync as jest.Mock).mockReturnValue(false);

      await expect(
        authenticationService.getAuthenticatedUser(
          'user@email.com',
          'wrongPassword',
        ),
      ).rejects.toThrow();
    });

    it('should return user if password valid', async () => {
      (bcrypt.compareSync as jest.Mock).mockReturnValue(true);

      const user = await authenticationService.getAuthenticatedUser(
        'user@email.com',
        'strongPassword',
      );

      expect(user).toEqual(userData);
      expect(mockUserRepository.findOne).toBeCalledWith({
        where: {
          email: 'user@email.com',
        },
      });
    });

    it('should the user is not found in the database', async () => {
      mockUserRepository.findOne.mockResolvedValue(undefined);

      await expect(
        authenticationService.getAuthenticatedUser(
          'user@email.com',
          'strongPassword',
        ),
      ).rejects.toThrow();
    });
  });
});
