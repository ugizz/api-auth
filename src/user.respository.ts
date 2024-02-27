import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { AuthCreateDto } from './data/dto/request/auth.create.dto';
import { User } from './data/entity/user.entity';
import { AuthCreateGuestDto } from './data/dto/request/auth.guest.create.dto';

@Injectable()
export class UserRepository extends Repository<User> {
  constructor(dataSource: DataSource) {
    super(User, dataSource.createEntityManager());
  }

  async createUser(authCreateDto: AuthCreateDto): Promise<any> {
    const { id, passwd, email, nickname } = authCreateDto;

    
    const salt = await bcrypt.genSalt();
    const hashedPasswd = await bcrypt.hash(passwd, salt);

    const user = this.create({
      address: id,
      passwd: hashedPasswd,
      salt: salt,
      email: email,
      nickname: nickname,
    });

    await this.save(user);
  }

  async createGuestUser(authCreateGuestDto: AuthCreateGuestDto): Promise<any> {
    const { guestId, nickname } = authCreateGuestDto;

    const user = this.create({ guestId, nickname });

    await this.save(user);
  }

  async findUser(userId: number): Promise<User> {
    return this.findOne({ where: { userId } });
  }

  async checkUsername(userName: string): Promise<boolean> {
    console.log(userName);
    if (await this.exists({ where: { address: userName } })) {
      return false;
    } else {
      return true;
    }
  }

  async checkNickname(nickname: string): Promise<boolean> {
    if (await this.exists({ where: { nickname: nickname } })) {
      return false;
    } else {
      return true;
    }
  }
}
