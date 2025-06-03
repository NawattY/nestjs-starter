import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserListResponseDto } from '../dtos/responses/user-list-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserQueryDto } from '../dtos/requests/user-query.dto';
import { JwtAuthGuard } from '#modules/auth/guards/jwt-auth.guard';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
  ApiTags,
} from '@nestjs/swagger';
import { userListResponse } from '../swagger/user-list.response';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users in the system',
  })
  @ApiResponse(userListResponse)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: UserQueryDto): Promise<UserListResponseDto> {
    const users = await this.userService.findAll(query);
    return plainToInstance(UserListResponseDto, users);
  }
}
