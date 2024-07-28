import { HttpException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RegisterUserDto } from './dto/register-user-dto';
import { LoginUserDto } from './dto/login-user.dto';
import { compare, hash } from 'bcrypt';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { InvalidCredentialsExceptions } from './exceptions/invalid-credentials.exception';
import { MailService } from '../mail/mail.service';
import { User } from '../user/entity/user.entity';

export interface JWTTokens {
  token: string;
}

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private configService: ConfigService,
    private mailService: MailService,
  ) {}

  get(): Promise<User[]> {
    return this.userRepository.find();
  }

  async register(registerUserDto: RegisterUserDto) {
    const existingUser = await this.userRepository.findOne({
      where: { email: registerUserDto.email },
    });

    if (existingUser) {
      throw new HttpException('Email has already been registered', 400);
    }

    const encryptedPassword = await this.hashPassword(registerUserDto.password);
    await this.userRepository.save({
      firstName: registerUserDto.firstName,
      lastName: registerUserDto.lastName,
      email: registerUserDto.email,
      password: encryptedPassword,
    });

    await this.mailService.sendWelcomeEmail(registerUserDto.email);
    return { messge: 'Successfully created user' };
  }

  async login(loginUserDto: LoginUserDto) {
    const { email, password } = loginUserDto;
    const user = await this.userRepository.findOne({
      where: { email },
    });

    if (!user) {
      throw new InvalidCredentialsExceptions();
    }
    const validatePassword = await compare(password, user.password);
    if (!validatePassword) {
      throw new InvalidCredentialsExceptions();
    }

    return this.getTokens(user);
  }

  async refreshTokens(token: string): Promise<JWTTokens> {
    try {
      const { sub: id, email } = await this.jwtService.verifyAsync(token, {
        secret: this.configService.get('JWT_REFRESH_TOKEN_SECRET'),
      });

      const user = await this.userRepository.findOneOrFail({
        where: { id, email },
      });

      return this.getTokens(user);
    } catch (error) {
      throw new InvalidCredentialsExceptions();
    }
  }

  private async hashPassword(password: string): Promise<string> {
    return hash(password, 10);
  }

  private async getTokens(user: User): Promise<JWTTokens> {
    const [token] = await Promise.all([
      this.jwtService.sign(
        { sub: user.id, email: user.email },
        {
          secret: this.configService.get<string>('JWT_ACCESS_TOKEN_SECRET'),
          expiresIn: this.configService.get<string>(
            'JWT_ACCESS_TOKEN_EXPIRATION',
          ),
        },
      ),
    ]);

    return { token };
  }
}
