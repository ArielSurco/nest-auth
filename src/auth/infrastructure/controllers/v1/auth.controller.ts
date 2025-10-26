import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { SignUp } from '../../../application/signUp';
import { GetUserByCredentials } from './../../../application/getUserByCredentials';
import { SignInDto } from './dtos/SignInDto';
import { SignUpDto } from './dtos/SignUpDto';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUp,
    private readonly getUserByCredentialsUseCase: GetUserByCredentials,
    private readonly jwtService: JwtService,
    private readonly configService: ConfigService,
  ) {}

  @Post('sign-up')
  @HttpCode(HttpStatus.CREATED)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signUp(@Body() signUpDto: SignUpDto) {
    const result = await this.signUpUseCase.execute(signUpDto);
    const resultPrimitive = result.toPrimitive();

    return {
      id: resultPrimitive.id,
      message: 'User created successfully',
    };
  }

  @Post('sign-in')
  @HttpCode(HttpStatus.OK)
  @UsePipes(new ValidationPipe({ transform: true }))
  async signIn(@Body() signInDto: SignInDto) {
    const userAccount =
      await this.getUserByCredentialsUseCase.execute(signInDto);

    if (!userAccount) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      token: this.jwtService.sign({ userId: userAccount.toPrimitive().id }),
      expiresIn: this.configService.get<string>('JWT_EXPIRES_IN'),
    };
  }
}
