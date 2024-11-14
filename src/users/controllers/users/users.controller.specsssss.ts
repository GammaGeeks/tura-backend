import { Test, TestingModule } from '@nestjs/testing';
import { UsersController } from './users.controller';
import { UsersService } from 'src/users/services/users/users.service';
import { CreateUserDto } from 'src/users/dtos/CreateUser.dto';
import { UpdateUserDto } from 'src/users/dtos/UpdateUser.dto';
import { UpdateUserSettingsDto } from 'src/users/dtos/UpdateUserSettings.dto';
import { HttpException, HttpStatus } from '@nestjs/common';

describe('UsersController', () => {
  let controller: UsersController;
  let service: UsersService;

  const mockUser = {
    id: 1,
    username: 'johndoe',
    email: 'johndoe@example.com',
    password: 'password123',
    fullname: 'John Doe',
    gender: 'MALE',
    address: '123 Main St',
    dob: new Date(),
    phoneNumber: '1234567890',
    profileImg: 'profile.jpg',
    coverImg: 'cover.jpg',
    role: 'CLIENT',
    isVerified: true,
    createdAt: new Date(),
    updatedAt: new Date(),
    userSetting: {
      id: 1,
      notificationsOn: true,
      smsEnabled: true,
      userId: 1,
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const mockUserSettings = {
    id: 1,
    notificationsOn: true,
    smsEnabled: true,
    userId: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UsersController],
      providers: [
        {
          provide: UsersService,
          useValue: {
            getUserByEmail: jest.fn(),
            getUserByUsername: jest.fn(),
            createUser: jest.fn(),
            getUsers: jest.fn(),
            updateUserByUsername: jest.fn(),
            deleteUserByUsername: jest.fn(),
            updateUserSettings: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<UsersController>(UsersController);
    service = module.get<UsersService>(UsersService);
  });

  describe('createUser', () => {
    it('should create a new user', async () => {
      const createUserDto: CreateUserDto = {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'CLIENT',
        isVerified: true,
      };

      jest.spyOn(service, 'getUserByEmail').mockResolvedValueOnce(null);
      jest.spyOn(service, 'getUserByUsername').mockResolvedValueOnce(null);
      jest.spyOn(service, 'createUser').mockResolvedValueOnce(mockUser);

      const result = await controller.createUser(createUserDto);
      expect(result).toEqual(mockUser);
    });

    it('should throw an error if email already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'CLIENT',
        isVerified: true,
      };

      jest.spyOn(service, 'getUserByEmail').mockResolvedValueOnce(mockUser);
      jest.spyOn(service, 'getUserByUsername').mockResolvedValueOnce(null);

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );
    });

    it('should throw an error if username already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'johndoe',
        email: 'johndoe@example.com',
        password: 'password123',
        role: 'CLIENT',
        isVerified: true,
      };

      jest.spyOn(service, 'getUserByEmail').mockResolvedValueOnce(null);
      jest.spyOn(service, 'getUserByUsername').mockResolvedValueOnce(mockUser);

      await expect(controller.createUser(createUserDto)).rejects.toThrow(
        new HttpException('User already exists', HttpStatus.BAD_REQUEST),
      );
    });
  });

  describe('getUsers', () => {
    it('should return all users', async () => {
      const mockUsers = [mockUser];
      jest.spyOn(service, 'getUsers').mockResolvedValue(mockUsers);

      expect(await controller.getUsers()).toBe(mockUsers);
    });
  });

  describe('getUserByUsername', () => {
    it('should return a user by username', async () => {
      jest.spyOn(service, 'getUserByUsername').mockResolvedValue(mockUser);

      expect(await controller.getUserByUsername('johndoe')).toBe(mockUser);
    });

    it('should throw an error if user not found', async () => {
      jest.spyOn(service, 'getUserByUsername').mockResolvedValue(null);

      await expect(controller.getUserByUsername('nonexistent')).rejects.toThrow(
        new HttpException('User Not Found', HttpStatus.NOT_FOUND),
      );
    });
  });

  describe('updateUserByUsername', () => {
    it('should update a user by username', async () => {
      const updateUserDto: UpdateUserDto = { email: 'newemail@example.com' };
      const updatedUser = { ...mockUser, email: 'newemail@example.com' };
      jest
        .spyOn(service, 'updateUserByUsername')
        .mockResolvedValue(updatedUser);

      expect(
        await controller.updateUserByUsername('johndoe', updateUserDto),
      ).toBe(updatedUser);
    });
  });

  describe('deleteUserByUsername', () => {
    it('should delete a user by username', async () => {
      jest.spyOn(service, 'deleteUserByUsername').mockResolvedValue(mockUser);

      expect(await controller.deleteUserByUsername('johndoe')).toBe(mockUser);
    });
  });

  describe('updateUserSettingsByUserUsername', () => {
    it('should update user settings by username', async () => {
      const updateUserSettingsDto: UpdateUserSettingsDto = {
        smsEnabled: true,
        notificationsOn: true,
      };

      const updatedUserSettings = {
        id: 1,
        smsEnabled: true,
        notificationsOn: true,
        userId: 1,
      };

      jest
        .spyOn(service, 'updateUserSettings')
        .mockResolvedValue(updatedUserSettings);

      const result = await controller.updateUserSettingsByUserUsername(
        'johndoe',
        updateUserSettingsDto,
      );

      expect(result).toBe(updatedUserSettings);
    });
  });
});
