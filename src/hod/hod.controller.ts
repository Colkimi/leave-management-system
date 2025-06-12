import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  Query,
  ParseIntPipe,
} from '@nestjs/common';
import { HodService } from './hod.service';
import { CreateHodDto } from './dto/create-hod.dto';
import { UpdateHodDto } from './dto/update-hod.dto';
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
import { Hod } from './entities/hod.entity';

@ApiTags('hod')
@ApiBearerAuth()
@Controller('hod')
@UseGuards(AtGuard, RolesGuard)
export class HodController {
  constructor(private readonly hodService: HodService) {}

  @Roles(Role.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new HOD',
    description: 'Creates a new Head of Department (HOD).',
  })
  @ApiResponse({
    status: 201,
    description: 'HOD created successfully',
    type: Hod,
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  create(@Body() createHodDto: CreateHodDto) {
    return this.hodService.create(createHodDto);
  }

  @Roles(Role.HOD, Role.ADMIN,Role.FACULTY)
  @Get()
  @ApiOperation({
    summary: 'Get all HODs',
    description: 'Retrieves a list of all Heads of Department (HODs).',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter HODs by username',
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
    description: 'List of HODs',
    type: [Hod],
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
    return this.hodService.findall(search, page, limit);
  }

  @Roles(Role.HOD, Role.ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get HOD by ID',
    description: 'Retrieves a Head of Department (HOD) by their ID.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the HOD to retrieve',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'HOD found',
    type: Hod,
  })
  @ApiNotFoundResponse({ description: 'HOD not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.hodService.findone(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update HOD details',
    description: 'Updates the details of a Head of Department (HOD).',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the HOD to update',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'HOD details updated successfully',
    type: Hod,
  })
  @ApiNotFoundResponse({ description: 'HOD not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateHodDto: UpdateHodDto,
  ) {
    return this.hodService.update(id, updateHodDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a HOD',
    description: 'Deletes a Head of Department (HOD).',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the HOD to delete',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'HOD deleted successfully',
    type: Hod,
  })
  @ApiNotFoundResponse({ description: 'HOD not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.hodService.remove(id);
  }
}
