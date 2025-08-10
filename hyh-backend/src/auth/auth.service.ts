import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { Prisma } from '@prisma/client';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  async register(email: string, password: string, name?: string) {
    const emailNorm = email.trim().toLowerCase();                 // 👈 normaliza
    const hashed = await bcrypt.hash(password, 10);
    try {
      const user = await this.prisma.user.create({
        data: { email: emailNorm, password: hashed, name },
      });
      return this.generateToken(user);
    } catch (err: any) {
      // Prisma duplicate key
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Email already registered');   // 409
      }
      throw err;
    }
  }

  async login(email: string, password: string) {
    const emailNorm = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: emailNorm } });
    if (!user) throw new UnauthorizedException('Invalid credentials');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Invalid credentials');

    return this.generateToken(user);
  }
  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, createdAt: true },
    });
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}
