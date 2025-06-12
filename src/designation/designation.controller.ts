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
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { DesignationService } from './designation.service';
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
import { Designation } from './entities/designation.entity';
import { AtGuard} from 'src/auth/guards';
import { Role } from 'src/profiles/entities/profile.entity';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators';

@ApiTags('designations')
@ApiBearerAuth()
@Controller('designation')
@UseGuards(AtGuard, RolesGuard)
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Post()
  @Roles(Role.ADMIN)
  @ApiOperation({
    summary: 'Create a new designation',
    description: 'Creates a new designation.',
  })
  @ApiResponse({
    status: 201,
    description: 'Designation created successfully',
    type: Designation,
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  create(@Body() createDesignationDto: CreateDesignationDto) {
    return this.designationService.create(createDesignationDto);
  }

  @Roles(Role.ADMIN, Role.FACULTY, Role.HOD)
  @Get()
  @ApiOperation({
    summary: 'Get all designations',
    description: 'Retrieves a list of all designations.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter designations by designation name',
    example: 'Sales Manager',
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
    description: 'List of designations',
    type: [Designation],
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  findAll(
    @Query('search') search?: string,
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.designationService.findall(search, page, limit);
  }

  @Roles(Role.ADMIN, Role.FACULTY, Role.HOD)
  @Get(':id')
  @ApiOperation({
    summary: 'Get designation by ID',
    description: 'Retrieves a designation by its ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the designation to retrieve',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Designation found',
    type: Designation,
  })
  @ApiNotFoundResponse({ description: 'Designation not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.designationService.findone(id);
  }


  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update designation details',
    description: 'Updates the details of a designation.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the designation to update',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Designation details updated successfully',
    type: Designation,
  })
  @ApiNotFoundResponse({ description: 'Designation not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateDesignationDto: UpdateDesignationDto,
  ) {
    (UpdateDesignationDto as any).designation_id = id;
    return this.designationService.update(id, UpdateDesignationDto);
  }

   @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a designation',
    description: 'Deletes a designation.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the designation to delete',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Designation deleted successfully',
    type: Designation,
  })
  @ApiNotFoundResponse({ description: 'Designation not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.designationService.remove(id);
  }
}
