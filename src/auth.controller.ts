import { Body, Controller, Get, Param, ValidationPipe } from '@nestjs/common';

import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AuthCreateDto } from './data/dto/request/auth.create.dto';
import { ResponseEntity } from './configs/ResponseEntity';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './data/dto/request/auth.login.dto';
import { AccessTokenDto } from './data/dto/response/auth.access.dto';
import { AuthCreateGuestDto } from './data/dto/request/auth.guest.create.dto';
import { AuthLoginGuestDto } from './data/dto/request/auth.guest.login.dto';
import { CheckDto } from './data/dto/response/auth.check.dto';
import { User } from './data/entity/user.entity';
import { Observable } from 'rxjs';

@Controller()
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @MessagePattern('signUp')
  async signUp(authCreateDto: AuthCreateDto): Promise<ResponseEntity<string>> {
    await this.authService.signUp(authCreateDto);
    return ResponseEntity.OK();
  }

  @MessagePattern('signIn')
  async signIn(
    authLoginDto: AuthLoginDto,
  ): Promise<ResponseEntity<AccessTokenDto>> {
    return ResponseEntity.OK_WITH(await this.authService.signIn(authLoginDto));
  }

  @MessagePattern('guestSignUp')
  async guestSignUp(
    authCreateGuestDto: AuthCreateGuestDto,
  ): Promise<ResponseEntity<string>> {
    await this.authService.guestSignUp(authCreateGuestDto);
    return ResponseEntity.OK();
  }

  @MessagePattern('guestSignIn')
  async guestSignIn(
    authLoginDto: AuthLoginGuestDto,
  ): Promise<ResponseEntity<AccessTokenDto>> {
    return ResponseEntity.OK_WITH(
      await this.authService.guestSignIn(authLoginDto),
    );
  }

  @MessagePattern('checkAddress')
  async checkUsername(address: string): Promise<ResponseEntity<CheckDto>> {
    return ResponseEntity.OK_WITH(await this.authService.checkAddress(address));
  }

  @MessagePattern('checkNickname')
  async checkNickname(nickname: string): Promise<ResponseEntity<CheckDto>> {
    return ResponseEntity.OK_WITH(
      await this.authService.checkNickname(nickname),
    );
  }

  @MessagePattern('findUserId')
  async findUserId(userId: number): Promise<User> {
    return await this.authService.findUserId(userId);
  }

  @MessagePattern('findNickname')
  async findNickname(nickname: string): Promise<User> {
    return await this.authService.findNickname(nickname);
  }
}
