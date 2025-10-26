import {
  Body,
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  UsePipes,
  ValidationPipe,
} from '@nestjs/common';
import { SignUp } from '../../../application/signUp';
import { SignUpDto } from './dtos/SignUpDto';

@Controller('v1/auth')
export class AuthController {
  constructor(private readonly signUpUseCase: SignUp) {}

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
}
