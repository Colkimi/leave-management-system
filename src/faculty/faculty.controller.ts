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
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { FacultyService } from './faculty.service';
import { AtGuard } from 'src/auth/guards';
import { Public, Roles } from 'src/auth/decorators';
import { Role } from 'src/profiles/entities/profile.entity';
import { RolesGuard } from 'src/auth/guards/role.guard';
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
import { Faculty } from './entities/faculty.entity';

@ApiTags('faculty')
@ApiBearerAuth()
@Controller('faculty')
@UseGuards(AtGuard, RolesGuard)
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  @Public()
  @ApiOperation({
    summary: 'Create a new faculty member',
    description:
      'Creates a new faculty member with the provided details. Requires FACULTY or ADMIN role.',
  })
  @ApiResponse({
    status: 201,
    description: 'Faculty member created successfully',
    type: Faculty,
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description:
      'You do not have permissions to access this resource. Requires FACULTY or ADMIN role.',
  })
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultyService.create(createFacultyDto);
  }

  @Roles(Role.ADMIN, Role.FACULTY, Role.HOD)
  @Get()
  @ApiOperation({
    summary: 'Get all faculty members',
    description:
      'Retrieves a list of all faculty members. Supports filtering by search. Requires FACULTY or ADMIN role.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter faculty members by name, email, or phone',
    example: 'john',
  })
  @ApiQuery({
    name: 'page',
    required: false,
    description: 'Page number',
    example: 1,
  })
  @ApiQuery({
    name: 'limit',
    required: false,
    description: 'Number of items per page',
    example: 10,
  })
  @ApiResponse({
    status: 200,
    description: 'List of faculty members',
    type: [Faculty],
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description:
      'You do not have permissions to access this resource. Requires FACULTY or ADMIN role.',
  })
  findAll(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.facultyService.findall(search, page, limit);
  }

  @Roles(Role.ADMIN, Role.FACULTY, Role.HOD)
  @Get(':faculty_id')
  @ApiOperation({
    summary: 'Get faculty member by ID',
    description:
      'Retrieves a faculty member by their ID. Requires FACULTY or ADMIN role.',
  })
  @ApiParam({
    name: 'faculty_id',
    required: true,
    description: 'ID of the faculty member to retrieve',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Faculty member found',
    type: Faculty,
  })
  @ApiNotFoundResponse({ description: 'Faculty member not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description:
      'You do not have permissions to access this resource. Requires FACULTY or ADMIN role.',
  })
  findOne(@Param('faculty_id', ParseIntPipe) id: number) {
    return this.facultyService.findone(id);
  }

  @Roles(Role.FACULTY, Role.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update faculty member details',
    description:
      'Updates the details of a faculty member. Requires FACULTY or ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the faculty member to update',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Faculty member details updated successfully',
    type: Faculty,
  })
  @ApiNotFoundResponse({ description: 'Faculty member not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description:
      'You do not have permissions to access this resource. Requires FACULTY or ADMIN role.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ) {
    (updateFacultyDto as any).faculty_id = id;
    return this.facultyService.update(id, updateFacultyDto);
  }

  @Roles(Role.ADMIN,Role.HOD)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a faculty member',
    description: 'Deletes a faculty member. Requires ADMIN role.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the faculty member to delete',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Faculty member deleted successfully',
    type: Faculty,
  })
  @ApiNotFoundResponse({ description: 'Faculty member not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description:
      'You do not have permissions to access this resource. Requires ADMIN role.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facultyService.remove(id);
  }
}
