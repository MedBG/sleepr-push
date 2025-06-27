import { Injectable, UnauthorizedException, UnprocessableEntityException } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersRepository } from './users.repository';
import * as bcrypt from 'bcryptjs'
import { GetUserDto } from './dtos/get-user.dto';
import { Types } from 'mongoose';


@Injectable()
export class UsersService {


        constructor(private readonly usersRepository: UsersRepository) { }

        async create(createUserDto: CreateUserDto) {
                await this.validateCreateUserDto(createUserDto)
                console.log("body from service", createUserDto)

                return this.usersRepository.create({
                        ...createUserDto,
                        password: await bcrypt.hash(createUserDto.password, 10),
                });
        }
        private async validateCreateUserDto(createUserDto: CreateUserDto) {
               try{
                await this.usersRepository.findOne({email:createUserDto.email});
               }
               catch(err){
                  return ;
               }
               throw new UnprocessableEntityException('Email already exists .')
        }

        async verifyUser(email: string, password: string) {
                const user = await this.usersRepository.findOne({ email });
                const passwordIsValid = await bcrypt.compare(password, user.password);
                if (!passwordIsValid) {
                        throw new UnauthorizedException('credentials is not valid')
                }
                return user;
        }

        findAll() {
                return this.usersRepository.find({})
        }

        getUser(getUserDto: GetUserDto) {
                const filter: any = { ...getUserDto };

                if (filter._id && typeof filter._id === 'string') {
                        filter._id = new Types.ObjectId(filter._id);
                }

                return this.usersRepository.findOne(filter);
        }


}
