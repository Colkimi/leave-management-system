import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { DepartmentService } from './department.service';
import {
  ApiBadRequestResponse,
  ApiBearerAuth,
  ApiForbiddenResponse,
  ApiNotFoundResponse,
  ApiOperation,
  ApiParam,
  ApiQuery,
  ApiResponse,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { Department } from './entities/department.entity';
import { AtGuard} from 'src/auth/guards';
import { Role } from 'src/profiles/entities/profile.entity';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators';

@ApiTags('departments')
@ApiBearerAuth()
@Controller('department')
@UseGuards(AtGuard, RolesGuard)
export class DepartmentController {
  constructor(private readonly departmentService: DepartmentService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new department',
    description: 'Creates a new department.',
  })
  @ApiResponse({
    status: 201,
    description: 'Department created successfully',
    type: Department,
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  create(@Body() createDepartmentDto: CreateDepartmentDto) {
    return this.departmentService.create(createDepartmentDto);
  }

  @Roles(Role.ADMIN,Role.FACULTY,Role.HOD)
  @Get()
  @ApiOperation({
    summary: 'Get all departments',
    description: 'Retrieves a list of all departments.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter departments by department name',
    example: 'Finance',
  })
  @ApiResponse({
    status: 200,
    description: 'List of departments',
    type: [Department],
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  findAll(@Query('search') search?: string) {
    return this.departmentService.findall(search);
  }

  @Roles(Role.ADMIN, Role.FACULTY, Role.HOD)
  @Get(':id')
  @ApiOperation({
    summary: 'Get department by ID',
    description: 'Retrieves a department by its ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the department to retrieve',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Department found',
    type: Department,
  })
  @ApiNotFoundResponse({ description: 'Department not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.findone(id);
  }

  @Roles(Role.ADMIN, Role.HOD)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update department details',
    description: 'Updates the details of a department.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the department to update',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Department details updated successfully',
    type: Department,
  })
  @ApiNotFoundResponse({ description: 'Department not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDepartmentDto: UpdateDepartmentDto,
  ) {
    (updateDepartmentDto as any).department_id = id;
    return this.departmentService.update(id, updateDepartmentDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a department',
    description: 'Deletes a department.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the department to delete',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Department deleted successfully',
    type: Department,
  })
  @ApiNotFoundResponse({ description: 'Department not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.departmentService.remove(id);
  }
}
