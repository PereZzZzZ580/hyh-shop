import { BadRequestException, ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Prisma, Role } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { PrismaService } from '../prisma/prisma.service';
import crypto from 'crypto';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService
  ) {}

  private desiredCost = (() => {
    const n = parseInt(process.env.BCRYPT_COST ?? '12', 10);
    if (!Number.isFinite(n)) return 12;
    return Math.min(Math.max(n, 10), 15);
  })();

  private async isPasswordPwned(password: string): Promise<boolean> {
    // Have I Been Pwned k-anonymity API
    try {
      const sha1 = crypto.createHash('sha1').update(password).digest('hex').toUpperCase();
      const prefix = sha1.slice(0, 5);
      const suffix = sha1.slice(5);
      const resp = await fetch(`https://api.pwnedpasswords.com/range/${prefix}`, {
        headers: { 'Add-Padding': 'true' },
      });
      if (!resp.ok) return false; // do not hard-fail on transient errors
      const text = await resp.text();
      return text.split('\n').some((line) => {
        const [hashSuffix, countStr] = line.trim().split(':');
        return hashSuffix === suffix && parseInt(countStr || '0', 10) > 0;
      });
    } catch {
      return false;
    }
  }

  private extractBcryptCost(hash: string): number | null {
    try {
      const parts = hash.split('$');
      const cost = parseInt(parts[2], 10);
      return Number.isFinite(cost) ? cost : null;
    } catch {
      return null;
    }
  }

  async register(email: string, password: string, name?: string) {
    const emailNorm = email.trim().toLowerCase();
    const disallowPwned = (process.env.DISALLOW_PWNED_PASSWORDS ?? 'true') === 'true';
    if (disallowPwned) {
      const pwned = await this.isPasswordPwned(password);
      if (pwned) {
        throw new BadRequestException('La contraseña se ha encontrado en filtraciones públicas. Por favor usa otra.');
      }
    }

    const hashed = await bcrypt.hash(password, this.desiredCost);
    try {
      const user = await this.prisma.user.create({
        data: { email: emailNorm, password: hashed, name, role: Role.CUSTOMER },
      });
      return this.generateToken(user);
    } catch (err: any) {
      // Prisma duplicate key
      if (err instanceof Prisma.PrismaClientKnownRequestError && err.code === 'P2002') {
        throw new ConflictException('Email already registered'); // 409
      }
      throw err;
    }
  }

  async login(email: string, password: string) {
    const emailNorm = email.trim().toLowerCase();
    const user = await this.prisma.user.findUnique({ where: { email: emailNorm } });
    if (!user) throw new UnauthorizedException('Credenciales inválidas');

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) throw new UnauthorizedException('Credenciales inválidas');

    // Opportunistic rehash if cost is below desired
    const currentCost = this.extractBcryptCost(user.password);
    if (currentCost && currentCost < this.desiredCost) {
      try {
        const newHash = await bcrypt.hash(password, this.desiredCost);
        await this.prisma.user.update({ where: { id: user.id }, data: { password: newHash } });
      } catch {
        // ignore rehash failure; do not block login
      }
    }

    return this.generateToken(user);
  }
  async me(userId: string) {
    return this.prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, email: true, name: true, role:true, createdAt: true },
    });
  }

  private generateToken(user: any) {
    const payload = { sub: user.id, email: user.email, role:user.role };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }
}

