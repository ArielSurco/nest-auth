import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  UnauthorizedException,
  UseGuards,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { GetUserById } from '../../../auth/application/getUserById';
import { SignUp } from '../../../auth/application/signUp';
import { Session } from '../../../auth/infrastructure/decorators/session.decorator';
import { AuthGuard } from '../../../auth/infrastructure/guards/auth.guard';
import {
  SessionPayload,
  SessionService,
} from '../../../auth/infrastructure/services/session.service';
import { GetUserByCredentials } from '../../../auth/application/getUserByCredentials';
import { SignInDto } from './dtos/SignInDto';
import { SignUpDto } from './dtos/SignUpDto';

@Controller('v1/auth')
export class AuthController {
  constructor(
    private readonly signUpUseCase: SignUp,
    private readonly getUserByCredentialsUseCase: GetUserByCredentials,
    private readonly sessionService: SessionService,
    private readonly getUserByIdUseCase: GetUserById,
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
      token: this.sessionService.sign({ userId: userAccount.toPrimitive().id }),
    };
  }

  @Get('me')
  @HttpCode(HttpStatus.OK)
  @UseGuards(AuthGuard)
  async me(@Session() session: SessionPayload) {
    const userAccount = await this.getUserByIdUseCase.execute(
      session?.userId ?? '',
    );
    const accountPrimitive = userAccount.toPrimitive();
    return {
      id: accountPrimitive.id,
      username: accountPrimitive.username,
      email: accountPrimitive.email,
    };
  }
}
