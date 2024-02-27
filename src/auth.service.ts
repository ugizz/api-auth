import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCreateDto } from './data/dto/request/auth.create.dto';
import { UserRepository } from './user.respository';
import { AccessTokenDto } from './data/dto/response/auth.access.dto';
import { AuthCreateGuestDto } from './data/dto/request/auth.guest.create.dto';
import { AuthLoginDto } from './data/dto/request/auth.login.dto';
import * as bcrypt from 'bcryptjs';
import { CheckDto } from './data/dto/response/auth.check.dto';
import { AuthLoginGuestDto } from './data/dto/request/auth.guest.login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './data/entity/user.entity';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private userRepository: UserRepository,
  ) {}

  async signUp(authCreateDto: AuthCreateDto): Promise<void> {
    return await this.userRepository.createUser(authCreateDto);
  }

  async guestSignUp(authCreateGuestDto: AuthCreateGuestDto): Promise<void> {
    return await this.userRepository.createGuestUser(authCreateGuestDto);
  }

  async signIn(authLoginDto: AuthLoginDto): Promise<AccessTokenDto> {
    const { id, passwd } = authLoginDto;
    try {
      // db에서 로그인 id로 user 객체 가져옴
      const user = await this.userRepository.findOne({
        where: { address: id },
      });
      const userId = user.userId;
      // db에서 조회한 해쉬화 된 패스워드와 
      const hashedPasswd = await bcrypt.hash(passwd, user.salt);
      if (user && user.passwd == hashedPasswd) {
        const payload = { userId };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken, nickname: user.nickname };
      } else {
        throw new UnauthorizedException('login failed');
      }
    } catch {
      throw new UnauthorizedException('token failed');
    }
  }

  async guestSignIn(authLoginDto: AuthLoginGuestDto): Promise<AccessTokenDto> {
    const { guestId } = authLoginDto;
    try {
      const user = await this.userRepository.findOne({
        where: { guestId: guestId },
      });

      const userId = user.userId;
      if (user && user.guestId === guestId) {
        const payload = { userId };
        const accessToken = await this.jwtService.sign(payload);
        return { accessToken, nickname: user.nickname };
      } else {
        throw new UnauthorizedException('login failed');
      }
    } catch {
      throw new UnauthorizedException('token failed');
    }
  }

  async checkAddress(address: string): Promise<CheckDto> {
    const check = await this.userRepository.checkUsername(address);
    return { check };
  }

  async checkNickname(nickname: string): Promise<CheckDto> {
    const check = await this.userRepository.checkNickname(nickname);
    return { check };
  }

  async findUserId(userId: number): Promise<User> {
    return await this.userRepository.findOne({ where: { userId: userId } });
  }

  async findNickname(nickname: string): Promise<User> {
    return await this.userRepository.findOne({ where: { nickname: nickname } });
  }
}
