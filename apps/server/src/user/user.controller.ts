import { Body, Controller, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { UserService } from './user.service';
import { AuthGuard } from 'src/auth/auth.guard';
import { UserProfileDTO, UserProfileUpdateDTO } from '@growiary/types';

@UseGuards(AuthGuard)
@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  findAll() {
    return this.userService.findUser();
  }

  @Post('profile')
  createUserProfile(@Body() userProfileDTO: UserProfileDTO) {
    return this.userService.createUserProfile(userProfileDTO);
  }

  @Patch('profile')
  async updateUserProfile(@Body() userProfileUpdateDTO: UserProfileUpdateDTO) {
    return this.userService.updateUserProfile(userProfileUpdateDTO);
  }
}
