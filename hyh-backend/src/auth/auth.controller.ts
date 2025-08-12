import { Body, Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtAuthGuard } from './jwt.guard';
import { ThrottlerGuard, Throttle, SkipThrottle } from '@nestjs/throttler';
import { ApiTags } from '@nestjs/swagger';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';

@UseGuards(ThrottlerGuard)
@ApiTags('auth')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('register')
  @Throttle(5, 60)
  register(@Body() dto: RegisterDto) {
    return this.authService.register(dto.email, dto.password, dto.name);
  }

  @Post('login')
  Throttle(5, 60)
  login(@Body() dto: LoginDto) {
    return this.authService.login(dto.email, dto.password);
  }

  @UseGuards(JwtAuthGuard)
  @SkipThrottle()
  @Get('me')
  me(@Req() req: any) {
    return this.authService.me(req.user.sub);
  }
}
