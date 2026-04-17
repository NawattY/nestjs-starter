import { JwtAuthGuard } from '@app/core/auth/jwt-auth.guard';
import { JwtPayload } from '@app/core/auth/jwt-payload.interface';
import { FindUsersInput } from '@app/modules/user/application/models/inputs/find-users.input';
import { UpdateUserInput } from '@app/modules/user/application/models/inputs/update-user.input';
import { UserService } from '@app/modules/user/application/user.service';
import { ROUTES } from '@app/routes/app-routes.constant';
import { CurrentUser } from '@app/shared/decorators/current-user.decorator';
import { Body, Controller, Get, Patch, Query, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';

import { FindUsersQueryDto } from '../dtos/requests/find-users-query.dto';
import { UpdateUserRequestDto } from '../dtos/requests/update-user-request.dto';
import { UserListResponseDto } from '../dtos/responses/user-list-response.dto';
import { UserResponseDto } from '../dtos/responses/user-response.dto';

@Controller(ROUTES.V1.USER.ROOT)
export class UserController {
  constructor(private readonly userService: UserService) {}

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

  @UseGuards(JwtAuthGuard)
  @Get(ROUTES.V1.USER.ME)
  async getMe(@CurrentUser() user: JwtPayload): Promise<UserResponseDto> {
    const userEntity = await this.userService.getById(user.uid);
    return plainToInstance(UserResponseDto, userEntity, {
      excludeExtraneousValues: true,
    });
  }

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
