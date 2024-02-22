import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthCreateDto } from './dto/auth.create.dto';
import { UserRepository } from './user.respository';
import { AccessTokenDto } from './dto/auth.access.dto';
import { AuthCreateGuestDto } from './dto/auth.guest.create.dto';
import { AuthLoginDto } from './dto/auth.login.dto';
import * as bcrypt from 'bcryptjs';
import { SearchUserDto } from './dto/auth.search.dto';
import { CheckDto } from './dto/auth.check.dto';
import { AuthLoginGuestDto } from './dto/auth.guest.login.dto';
import { JwtService } from '@nestjs/jwt';
import { User } from './entity/user.entity';


@Injectable()
export class AuthService {
    constructor(
        private jwtService: JwtService,
        private userRepository: UserRepository,
    ) { }

    async signUp(authCreateDto: AuthCreateDto): Promise<void> {
        return await this.userRepository.createUser(authCreateDto);
    }

    async guestSignUp(authCreateGuestDto: AuthCreateGuestDto): Promise<void> {
        return await this.userRepository.createGuestUser(authCreateGuestDto);
    }

    async signIn(authLoginDto: AuthLoginDto): Promise<AccessTokenDto> {
        const { id, passwd } = authLoginDto;
        try {
            const user = await this.userRepository.findOne({ where: { address: id } });
            const userId = user.userId;
            const hashedPasswd = await bcrypt.hash(passwd, user.salt);
            if(user &&  user.passwd == hashedPasswd) {
                const payload = { userId };
                const accessToken = await this.jwtService.sign(payload);
                return { 'accessToken': accessToken };
            } else {
                throw new UnauthorizedException('login failed')
            }
        } catch {
              throw new UnauthorizedException('token failed')
        }
    }

    async guestSignIn(authLoginDto: AuthLoginGuestDto): Promise<AccessTokenDto> {
        const { guestId } = authLoginDto;
        try {
            const user = await this.userRepository.findOne({ where: { guestId: guestId } });
            const userId = user.userId;
            if(user && user.guestId === guestId) {
                const payload = { userId };
                const accessToken = await this.jwtService.sign(payload);
                return { accessToken };
            }  else {
                throw new UnauthorizedException('login failed')
            }
        } catch {
             throw new UnauthorizedException('token failed')
        }
     
    }

    async checkAddress(address: string): Promise<CheckDto> {
        const check = await this.userRepository.checkUsername(address);
        return {check}
    }

    async checkNickname(nickname: string): Promise<CheckDto> {
        const check = await this.userRepository.checkNickname(nickname);
        return {check}
    }

    async findUserId(userId: number): Promise<User> {
        return await this.userRepository.findOne({ where: { userId: userId } });
    }

    async findNickname(nickname: string): Promise<User> {
        return await this.userRepository.findOne({ where: { nickname: nickname } });
    }

}
