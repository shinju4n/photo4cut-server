import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import { AuthDto } from './dto/auth.dto';
import { AuthService } from './auth.service';

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
}
