import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUserService = {
  get: jest.fn(),
  create: jest.fn(),
  update: jest.fn(),
  getUser: jest.fn(),
  deleteUser: jest.fn(),
  remove: jest.fn(),
};

describe('UserController', () => {
  let userController: UserController;
  let userService: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [{ provide: UserService, useValue: mockUserService }],
    }).compile();

    userController = module.get<UserController>(UserController);
    userService = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(userController).toBeDefined();
  });

  describe('get', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, email: 'test@example.com' }];
      mockUserService.get.mockResolvedValue(result);

      expect(await userController.getUsers()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'mary',
        lastName: 'john',
        password: 'password',
      };

      const result = { id: 1, ...createUserDto };
      mockUserService.create.mockResolvedValue(result);

      expect(await userController.store(createUserDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'test@example.com',
        firstName: 'Nonso',
        lastName: 'GAbriel',
        password: 'Password',
      };

      const result = { ...updateUserDto };
      mockUserService.update.mockResolvedValue(result);

      expect(await userController.update(updateUserDto, 1)).toBe(result);
    });
  });

  describe('getUser', () => {
    it('should return a user by ID', async () => {
      const result = { id: 1, email: 'test@example.com' };
      mockUserService.getUser.mockResolvedValue(result);

      expect(await userController.getUser(1)).toBe(result);
    });
  });

  describe('deleteUser', () => {
    it('should delete a user by ID', async () => {
      const result = { affected: 1 };
      mockUserService.deleteUser.mockResolvedValue(result);

      expect(await userController.deleteUser(1));
    });
  });
});
