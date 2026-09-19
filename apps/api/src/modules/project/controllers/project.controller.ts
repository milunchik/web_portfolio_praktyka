import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  CreateProjectService,
  DeleteProjectService,
  FindProjectByIdService,
  FindProjectsByUserService,
  UpdateProjectService,
} from '../services';
import { CreateProjectReqDto, UpdateProjectReqDto } from '../dtos/req';
import { ProjectResDto } from '../dtos/res';
import { JwtAuthGuard } from '../../../shared/guards';
import { CurrentUser } from '../../../shared/decorators/current-user.decorator';

@ApiTags('project')
@Controller('project')
export class ProjectController {
  constructor(
    private readonly createProjectService: CreateProjectService,
    private readonly findProjectByIdService: FindProjectByIdService,
    private readonly findProjectsByUserService: FindProjectsByUserService,
    private readonly updateProjectService: UpdateProjectService,
    private readonly deleteProjectService: DeleteProjectService,
  ) {}

  @ApiOperation({ summary: 'Get all projects of current user' })
  @ApiResponse({ status: 200, type: [ProjectResDto] })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Get('me')
  async getMyProjects(@CurrentUser() userId: number): Promise<ProjectResDto[]> {
    const projects = await this.findProjectsByUserService.execute(userId);
    return projects.map((proj) => proj.toResponseDto());
  }

  @ApiOperation({ summary: 'Get all projects by user ID' })
  @ApiResponse({ status: 200, type: [ProjectResDto] })
  @Get('user/:userId')
  async getByUserId(
    @Param('userId', ParseIntPipe) userId: number,
  ): Promise<ProjectResDto[]> {
    const projects = await this.findProjectsByUserService.execute(userId);
    return projects.map((proj) => proj.toResponseDto());
  }

  @ApiOperation({ summary: 'Get project by ID' })
  @ApiResponse({ status: 200, type: ProjectResDto })
  @Get(':id')
  async getById(
    @Param('id', ParseIntPipe) id: number,
  ): Promise<ProjectResDto> {
    const project = await this.findProjectByIdService.execute(id);
    return project.toResponseDto();
  }

  @ApiOperation({ summary: 'Create project for current user' })
  @ApiResponse({ status: 201, type: ProjectResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Post()
  async create(
    @CurrentUser() userId: number,
    @Body() dto: CreateProjectReqDto,
  ): Promise<ProjectResDto> {
    const project = await this.createProjectService.execute(userId, dto);
    return project.toResponseDto();
  }

  @ApiOperation({ summary: 'Update project by ID for current user' })
  @ApiResponse({ status: 200, type: ProjectResDto })
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  async update(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
    @Body() dto: UpdateProjectReqDto,
  ): Promise<ProjectResDto> {
    const project = await this.updateProjectService.execute(userId, id, dto);
    return project.toResponseDto();
  }

  @ApiOperation({ summary: 'Delete project by ID for current user' })
  @ApiResponse({ status: 204, description: 'Project deleted successfully' })
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiBearerAuth('AccessToken')
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async delete(
    @CurrentUser() userId: number,
    @Param('id', ParseIntPipe) id: number,
  ): Promise<void> {
    await this.deleteProjectService.execute(userId, id);
  }
}
