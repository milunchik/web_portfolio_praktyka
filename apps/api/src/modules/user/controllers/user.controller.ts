import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { FindUserByIdService } from '../services';
import { JwtAuthGuard } from '../../../shared/guards';
import { CurrentUser } from '../../../shared/decorators';

@ApiTags('user')
@Controller('user')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth('AccessToken')
export class UserController {
  constructor(private readonly findUserById: FindUserByIdService) {}

  @ApiOperation({ summary: 'Get current user profile' })
  @Get('me')
  async getMe(@CurrentUser() userId: number) {
    return this.findUserById.execute(userId);
  }

  @ApiOperation({ summary: 'Get user by ID' })
  @Get(':id')
  async findById(@Param('id', ParseIntPipe) id: number) {
    return this.findUserById.execute(id);
  }
}
