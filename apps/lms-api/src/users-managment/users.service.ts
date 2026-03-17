import {
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import * as bcrypt from 'bcryptjs';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from './entities/user.entity';
import { UserAuthPayload, UserRole } from '../common/models/users.models';
import { log } from 'console';
import { Repository } from 'typeorm';
import { FindUserInput } from './dto/find-user.input';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(Users)
    private usersRepo: Repository<Users>,
    private jwtService: JwtService,
  ) {}

  async create(createUserInput: CreateUserInput) {
    const existingUser = await this.usersRepo.findOne({
      where: {
        email: createUserInput.email,
      },
    });

    if (existingUser) throw new ConflictException('Email already in use');

    const hashdPass: string = await bcrypt.hash(createUserInput.password, 10);

    const newUser = this.usersRepo.create({
      username: createUserInput.username,
      email: createUserInput.email,
      password: hashdPass,
      isBlocked: false,
      role: UserRole.USER,
      createdAt: new Date(),
    });

    return await this.usersRepo.save(newUser);
  }

  findAll() {
    return `This action returns all users`;
  }

  async findUser(findUser: FindUserInput) {
    const targetUser = await this.usersRepo.findOne({
      where: {
        email: findUser.email,
        role: UserRole.USER,
      },
    });

    if (!targetUser) throw new UnauthorizedException('no use with this email');

    const isPasswordMatch = await bcrypt.compare(
      findUser.password,
      targetUser.password,
    );

    const payload: UserAuthPayload = {
      sub: targetUser.id,
      username: targetUser.username,
      role: UserRole.USER,
      email: targetUser.email,
    };

    if (isPasswordMatch)
      return { access_token: await this.jwtService.signAsync(payload) };
  }

  async getUserFromToken(token: string) {
    const payload = this.jwtService.verify(token);
    log(payload);
    return payload; // return payload if valid
  }

  update(id: number, updateUserInput: UpdateUserInput) {
    return `This action updates a #${id} user`;
  }

  remove(id: number) {
    return `This action removes a #${id} user`;
  }
}
