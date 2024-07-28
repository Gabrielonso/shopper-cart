import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { RegisterUserDto } from './dto/register-user-dto';
import { LoginUserDto } from './dto/login-user.dto';

const mockAuthService = {
  register: jest.fn(),
  login: jest.fn(),
  refreshTokens: jest.fn(),
};

describe('AuthController', () => {
  let authController: AuthController;
  let authService: AuthService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: mockAuthService }],
    }).compile();

    authController = module.get<AuthController>(AuthController);
    authService = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(authController).toBeDefined();
  });

  describe('register', () => {
    it('should call authService.register with correct params', async () => {
      const registerUserDto: RegisterUserDto = {
        email: 'test@example.com',
        password: 'password',
        firstName: 'John',
        lastName: 'Doe',
      };

      await authController.register(registerUserDto);

      expect(mockAuthService.register).toHaveBeenCalledWith(registerUserDto);
    });
  });

  describe('login', () => {
    it('should call authService.login with correct params', async () => {
      const loginUserDto: LoginUserDto = {
        email: 'test@example.com',
        password: 'password',
      };

      await authController.login(loginUserDto);

      expect(mockAuthService.login).toHaveBeenCalledWith(loginUserDto);
    });
  });

  describe('refreshToken', () => {
    it('should call authService.refreshTokens with correct params', async () => {
      const refreshTokenDto = { refreshToken: 'some-refresh-token' };

      await authController.refreshToken(refreshTokenDto);

      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        'some-refresh-token',
      );
    });
  });
});
