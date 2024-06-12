import {
  Body,
  Controller,
  Get,
  Post,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';
import { GetUser } from 'src/common/decorators/get-user.decorator';
import { User } from './user.entity';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/sign-up')
  async signUp(@Body(ValidationPipe) auth: AuthDto) {
    return this.authService.signUp(auth);
  }

  @Post('/login')
  async login(@Body(ValidationPipe) auth: AuthDto) {
    return this.authService.login(auth);
  }

  @Get('/me')
  @UseGuards(AuthGuard())
  getProfile(@GetUser() user: User) {
    return this.authService.getProfile(user);
  }
}
