import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserService } from '../services/user.service';
import { UserListResponseDto } from '../dtos/responses/user-list-response.dto';
import { plainToInstance } from 'class-transformer';
import { UserRequestDto } from '../dtos/requests/user-request.dto';
import { JwtAuthGuard } from '#modules/auth/guards/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { userListResponse } from '../swagger/user-list.response';
import { ApiResponses } from '#shared/decorators/api-response.decorator';

@ApiTags('User')
@Controller('users')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get all users',
    description: 'Retrieve a list of all users in the system',
  })
  @ApiResponses(userListResponse)
  @UseGuards(JwtAuthGuard)
  @Get()
  async findAll(@Query() query: UserRequestDto): Promise<UserListResponseDto> {
    const users = await this.userService.findAll(query);
    return plainToInstance(UserListResponseDto, users);
  }
}
