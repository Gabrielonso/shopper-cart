import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from '../user/entity/user.entity';
import { Repository } from 'typeorm';
import { MailService } from '../mail/mail.service';
import { ConfigService } from '@nestjs/config';
import { InvalidCredentialsExceptions } from './exceptions/invalid-credentials.exception';
import { RegisterUserDto } from './dto/register-user-dto';
import { LoginUserDto } from './dto/login-user.dto';
import * as bcrypt from 'bcrypt';
import { HttpException } from '@nestjs/common';

const mockUserRepository = {
  find: jest.fn(),
  findOne: jest.fn(),
  save: jest.fn(),
  findOneOrFail: jest.fn(),
};

const mockMailService = {
  sendWelcomeEmail: jest.fn(),
};

const mockConfigService = {
  get: jest.fn((key: string) => {
    switch (key) {
      case 'JWT_ACCESS_TOKEN_SECRET':
        return 'test-secret';
      case 'JWT_REFRESH_TOKEN_SECRET':
        return 'test-refresh-secret';
      case 'JWT_ACCESS_TOKEN_EXPIRATION':
        return '60m';
      case 'JWT_REFRESH_TOKEN_EXPIRATION':
        return '7d';
      default:
        return null;
    }
  }),
};

describe('AuthService', () => {
  let authService: AuthService;
  let jwtService: JwtService;
  let userRepository: Repository<User>;
  let configService: ConfigService;
  let mailService: MailService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        JwtService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
        { provide: ConfigService, useValue: mockConfigService },
        { provide: MailService, useValue: mockMailService },
      ],
    }).compile();

    authService = module.get<AuthService>(AuthService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
    jwtService = module.get<JwtService>(JwtService);
    configService = module.get<ConfigService>(ConfigService);
    mailService = module.get<MailService>(MailService);
  });

  it('should be defined', () => {
    expect(authService).toBeDefined();
  });

  describe('register', () => {
    it('should register a new user', async () => {
      const registerUserDto: RegisterUserDto = {
        firstName: 'Margima',
        lastName: 'Ben',
        email: 'test@example.com',
        password: 'password',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);
      jest.spyOn(userRepository, 'save').mockResolvedValue({
        id: 1,
        ...registerUserDto,
        password: 'hashedPassword',
      } as any);
      jest
        .spyOn(authService as any, 'hashPassword')
        .mockResolvedValue('hashedPassword');
      jest.spyOn(mailService, 'sendWelcomeEmail').mockResolvedValue(undefined);

      await authService.register(registerUserDto);

      expect(userRepository.findOne).toHaveBeenCalledWith({
        where: { email: registerUserDto.email },
      });
      expect((authService as any).hashPassword).toHaveBeenCalledWith(
        registerUserDto.password,
      );
      expect(userRepository.save).toHaveBeenCalledWith({
        ...registerUserDto,
        password: 'hashedPassword',
      });
      expect(mailService.sendWelcomeEmail).toHaveBeenCalledWith(
        registerUserDto.email,
      );
    });

    describe('login', () => {
      it('should login the user', async () => {
        const loginUserDto: LoginUserDto = {
          email: 'test@example.com',
          password: 'password',
        };

        const user: User = {
          id: 1,
          firstName: 'Monday',
          lastName: 'Sunday',
          email: 'test@example.com',
          password: 'hashedPassword',
        } as any;

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(() => Promise.resolve(true));
        jest
          .spyOn(authService as any, 'getTokens')
          .mockResolvedValue({ token: 'accessToken' });

        const result = await authService.login(loginUserDto);

        expect(userRepository.findOne).toHaveBeenCalledWith({
          where: { email: loginUserDto.email },
        });
        expect(bcrypt.compare).toHaveBeenCalledWith(
          loginUserDto.password,
          user.password,
        );
        expect((authService as any).getTokens).toHaveBeenCalledWith(user);
        expect(result).toEqual({ token: 'accessToken' });
      });

      it('should throw an error if the email is not found', async () => {
        const loginUserDto: LoginUserDto = {
          email: 'test@example.com',
          password: 'password',
        };

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(null);

        await expect(authService.login(loginUserDto)).rejects.toThrow(
          new InvalidCredentialsExceptions(),
        );
      });

      it('should throw an error if the password is incorrect', async () => {
        const loginUserDto: LoginUserDto = {
          email: 'test@example.com',
          password: 'password',
        };

        const user: User = {
          id: 1,
          firstName: 'Fisher',
          lastName: 'Willams',
          email: 'test@example.com',
          password: 'hashedPassword',
        } as any;

        jest.spyOn(userRepository, 'findOne').mockResolvedValue(user);
        jest
          .spyOn(bcrypt, 'compare')
          .mockImplementation(() => Promise.resolve(false));

        await expect(authService.login(loginUserDto)).rejects.toThrow(
          new InvalidCredentialsExceptions(),
        );
      });
    });

    describe('refreshTokens', () => {
      it('should refresh the tokens', async () => {
        const token = 'refreshToken';
        const user: User = {
          id: 1,
          email: 'test@example.com',
        } as any;

        jest
          .spyOn(jwtService, 'verifyAsync')
          .mockResolvedValue({ sub: user.id, email: user.email });
        jest.spyOn(userRepository, 'findOneOrFail').mockResolvedValue(user);
        jest
          .spyOn(authService as any, 'getTokens')
          .mockResolvedValue({ token: 'accessToken' });

        const result = await authService.refreshTokens(token);

        expect(jwtService.verifyAsync).toHaveBeenCalledWith(token, {
          secret: configService.get('JWT_REFRESH_TOKEN_SECRET'),
        });
        expect(userRepository.findOneOrFail).toHaveBeenCalledWith({
          where: { id: user.id, email: user.email },
        });
        expect((authService as any).getTokens).toHaveBeenCalledWith(user);
        expect(result).toEqual({ token: 'accessToken' });
      });

      it('should throw an error if the token is invalid', async () => {
        const token = 'invalidToken';

        jest.spyOn(jwtService, 'verifyAsync').mockRejectedValue(new Error());

        await expect(authService.refreshTokens(token)).rejects.toThrow(
          new InvalidCredentialsExceptions(),
        );
      });
    });

    it('should throw an error if the email is already registered', async () => {
      const registerUserDto: RegisterUserDto = {
        firstName: 'John',
        lastName: 'Doe',
        email: 'test@example.com',
        password: 'password',
        confirmPassword: 'password',
      };

      jest.spyOn(userRepository, 'findOne').mockResolvedValue({} as any);

      await expect(authService.register(registerUserDto)).rejects.toThrow(
        new HttpException('Email has already been registered', 400),
      );
    });
  });
});
