import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  UnauthorizedException,
} from '@nestjs/common';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './user.entity';
import { AuthDto } from './dto/auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private userRepository: Repository<User>,
    private jwtService: JwtService,
    private configService: ConfigService,
  ) {}

  async signUp(authDto: AuthDto) {
    const { email, password } = authDto;
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = this.userRepository.create({
      email,
      password: hashedPassword,
      loginType: 'email',
    });

    try {
      const { email } = await this.userRepository.save(user);
      return email;
    } catch (error) {
      if (error.code === '23505') {
        throw new ConflictException('이미 존재하는 이메일입니다.');
      }
      throw new InternalServerErrorException(
        '회원가입 도중 에러가 발생했습니다.',
      );
    }
  }

  private async getTokens(payload: { email: string }) {
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_ACCESS_TOKEN_EXPIRES_IN'),
      }),
      this.jwtService.signAsync(payload, {
        secret: this.configService.get('JWT_SECRET'),
        expiresIn: this.configService.get('JWT_REFRESH_TOKEN_EXPIRES_IN'),
      }),
    ]);

    return { accessToken, refreshToken };
  }

  private async updateHashedRefreshToken(userId: number, refreshToken: string) {
    const salt = await bcrypt.genSalt();
    const hashedRefreshToken = await bcrypt.hash(refreshToken, salt);

    try {
      await this.userRepository.update(userId, { hashedRefreshToken });
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        '회원가입 도중 에러가 발생했습니다.',
      );
    }
  }

  async login(authDto: AuthDto) {
    const { email, password } = authDto;
    const user = await this.userRepository.findOneBy({ email });
    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new UnauthorizedException(
        '이메일 또는 비밀번호가 일치하지 않습니다.',
      );
    }

    const { accessToken, refreshToken } = await this.getTokens({ email });
    await this.updateHashedRefreshToken(user.id, refreshToken);

    return { accessToken, refreshToken };
  }

  async getProfile(user: User) {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, hashedRefreshToken, ...rest } = user;

    return { ...rest };
  }
}
