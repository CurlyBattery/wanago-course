import { AuthenticationService } from '../authentication.service';
import { UsersService } from '../../users/users.service';
import { Repository } from 'typeorm';
import { UserEntity } from '../../users/entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

const mockRepo = {
  getByEmail: jest.fn(),
  create: jest.fn(),
} as unknown as Repository<UserEntity>;

describe('Get Cookie With Jwt', () => {
  let authenticationService: AuthenticationService;
  beforeEach(() => {
    authenticationService = new AuthenticationService(
      new UsersService(mockRepo),
      new JwtService({
        secret:
          '07ff2824ae8a3688845e5df3be48413f4eda6fd801fb27fba80b74ffa69062f3',
      }),
      new ConfigService(),
    );
  });

  describe('when creating a cookie', () => {
    it('should return a string', async () => {
      const userId = 1;
      const object = await authenticationService.getCookieWithJwt(userId);
      expect(typeof object.accessToken).toEqual('string');
    });
  });
});
