import { Body, Controller, Get, Param, ValidationPipe } from '@nestjs/common';

import { EventPattern, MessagePattern } from '@nestjs/microservices';
import { AuthCreateDto } from './dto/auth.create.dto';
import { ResponseEntity } from './configs/ResponseEntity';
import { AuthService } from './auth.service';
import { AuthLoginDto } from './dto/auth.login.dto';
import { AccessTokenDto } from './dto/auth.access.dto';
import { AuthCreateGuestDto } from './dto/auth.guest.create.dto';
import { SearchUserDto } from './dto/auth.search.dto';
import { AuthLoginGuestDto } from './dto/auth.guest.login.dto';
import { CheckDto } from './dto/auth.check.dto';
import { User } from './entity/user.entity';
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
