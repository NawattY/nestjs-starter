import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { plainToInstance } from 'class-transformer';

import { JwtPayload } from '@app/core/auth/jwt-payload.interface';
import { UserService } from '@app/modules/user/application/user.service';
import { FindUsersInput } from '@app/modules/user/application/models/inputs/find-users.input';
import { UpdateUserInput } from '@app/modules/user/application/models/inputs/update-user.input';
import { JwtAuthGuard } from '@app/core/auth/jwt-auth.guard';
import { ROUTES } from '@app/routes/app-routes.constant';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { ApiResponses } from '@app/shared/decorators/api-response.decorator';

import { FindUsersQueryDto } from '../dtos/requests/find-users-query.dto';
import { UpdateUserRequestDto } from '../dtos/requests/update-user-request.dto';
import { UserListResponseDto } from '../dtos/responses/user-list-response.dto';
import { UserResponseDto } from '../dtos/responses/user-response.dto';
import { getMeResponse } from '../swagger/get-me.response';
import { getUsersResponse } from '../swagger/get-users.response';
import { updateMeResponse } from '../swagger/update-me.response';

@ApiTags('User')
@Controller(ROUTES.V1.USER.ROOT)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get users list',
    description: 'Retrieve a paginated list of users',
  })
  @ApiResponses(getUsersResponse)
  @UseGuards(JwtAuthGuard)
  @Get()
  async getUsers(@Query() query: FindUsersQueryDto): Promise<UserListResponseDto> {
    const input = new FindUsersInput({
      page: query.page,
      perPage: query.perPage,
    });
    const result = await this.userService.findAll(input);

    return plainToInstance(UserListResponseDto, result, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieve the profile of the currently authenticated user',
  })
  @ApiResponses(getMeResponse)
  @UseGuards(JwtAuthGuard)
  @Get(ROUTES.V1.USER.ME)
  async getMe(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    const userEntity = await this.userService.getById(user.uid);
    return plainToInstance(UserResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });
  }

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Update current user profile',
    description: 'Update the profile of the currently authenticated user',
  })
  @ApiResponses(updateMeResponse)
  @UseGuards(JwtAuthGuard)
  @Patch(ROUTES.V1.USER.ME)
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const input = new UpdateUserInput({
      userId: user.uid,
      email: dto.email,
      firstName: dto.firstName,
      lastName: dto.lastName,
    });
    const updated = await this.userService.update(input);

    return plainToInstance(UserResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }
}