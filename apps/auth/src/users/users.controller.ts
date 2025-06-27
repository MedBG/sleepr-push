import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';
import { UsersService } from './users.service';
import { CurrentUser,UserDocument, JwtAuthGuard} from '@app/common';

@Controller('users')
export class UsersController {
    constructor(private readonly usersService: UsersService) {


    }
@UseGuards(JwtAuthGuard)
    @Post()
    async createUser(@Body() createUserDto: CreateUserDto) {
        return this.usersService.create(createUserDto);
    }


    @Get()
    @UseGuards(JwtAuthGuard)
    async getUser(@CurrentUser() user: UserDocument) {
        return user;
    }
    @Get('all')
async getAll() {
  return this.usersService.findAll(); // fais un `this.userModel.find()`
}


}
