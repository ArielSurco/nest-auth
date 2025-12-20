import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService, JwtSignOptions } from '@nestjs/jwt';
import { Request } from 'express';

export interface SessionPayload {
  userId: string;
  iat: number;
  exp: number;
}

@Injectable()
export class SessionService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  async isValidToken(token: string): Promise<boolean> {
    const payload = await this.getPayload(token);

    if (!payload) return false;

    return payload.exp > Date.now() / 1000;
  }

  sign(payload: Omit<SessionPayload, 'iat' | 'exp'>): string {
    return this.jwtService.sign(payload, {
      expiresIn: this.getExpiresIn(),
    });
  }

  async getPayload(token: string | null): Promise<SessionPayload | null> {
    try {
      return await this.jwtService.verifyAsync<SessionPayload>(token ?? '');
    } catch {
      return null;
    }
  }

  extractTokenFromRequest(request: Request): string | null {
    const [type, token] = request.headers.authorization?.split(' ') ?? [];

    if (type === 'Bearer') return token;

    const cookies = (request.cookies ?? {}) as Record<string, string>;

    return cookies['access_token'] ?? null;
  }

  getExpiresIn(): JwtSignOptions['expiresIn'] {
    return this.configService.get<number>('JWT_EXPIRES_IN') ?? undefined;
  }
}
