import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entity/user.entity';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

const mockUserRepository = {
  find: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  delete: jest.fn(),
};

describe('UserService', () => {
  let userService: UserService;
  let userRepository: Repository<User>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    userService = module.get<UserService>(UserService);
    userRepository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(userService).toBeDefined();
  });

  describe('get', () => {
    it('should return an array of users', async () => {
      const result = [{ id: 1, email: 'test@example.com' }];
      mockUserRepository.find.mockResolvedValue(result);

      expect(await userService.get()).toBe(result);
    });
  });

  describe('create', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        email: 'test@example.com',
        firstName: 'Greenwood',
        lastName: 'Harry',
        password: 'password',
      };

      const result = { id: 1, ...createUserDto };
      mockUserRepository.save.mockResolvedValue(result);

      expect(await userService.create(createUserDto)).toBe(result);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'test@example.com',
        firstName: 'Latifa',
        lastName: 'Idowu',
        password: '',
      };

      const result = { ...updateUserDto };
      mockUserRepository.update.mockResolvedValue(result);

      expect(await userService.update(updateUserDto, 1)).toBe(result);
    });
  });

  describe('getById', () => {
    it('should return a user by ID', async () => {
      const result = { id: 1, email: 'test@example.com' };
      mockUserRepository.findOne.mockResolvedValue(result);

      expect(await userService.getUser(1)).toBe(result);
    });
  });

  describe('delete', () => {
    it('should delete a user by ID', async () => {
      const result = { affected: 1 };
      mockUserRepository.delete.mockResolvedValue(result);

      expect(await userService.remove(1)).toBe(result);
    });
  });
});
