import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from '#core/auth/jwt-auth.guard';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { ApiResponses } from '#shared/decorators/api-response.decorator';
import { UserService } from '#modules/user/services/user.service';
import { CurrentUser } from '#shared/decorators/current-user.decorator';
import { JwtPayload } from '#modules/auth/rbac/jwt-payload.interface';
import { getMeResponse, updateMeResponse } from '../swagger';
import { UserResponseDto } from '../dtos/responses/user-response.dto';
import { UpdateUserRequestDto } from '../dtos/requests/update-user-request.dto';

@ApiTags('User')
@Controller({
  path: 'users',
  version: '1',
})
export class UserController {
  constructor(private readonly userService: UserService) {}

  @ApiBearerAuth()
  @ApiOperation({
    summary: 'Get current user profile',
    description: 'Retrieve the profile of the currently authenticated user',
  })
  @ApiResponses(getMeResponse)
  @UseGuards(JwtAuthGuard)
  @Get('me')
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
  @Patch('me')
  async updateMe(
    @CurrentUser() user: JwtPayload,
    @Body() dto: UpdateUserRequestDto,
  ): Promise<UserResponseDto> {
    const updated = await this.userService.update({
      userId: user.uid,
      ...dto,
    });
    return plainToInstance(UserResponseDto, updated, {
      excludeExtraneousValues: true,
    });
  }
}
