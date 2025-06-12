import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { LeaveAllotmentService } from './leave-allotment.service';
import { CreateLeaveAllotmentDto } from './dto/create-leave-allotment.dto';
import { UpdateLeaveAllotmentDto } from './dto/update-leave-allotment.dto';
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
import { Allotment } from './entities/leave-allotment.entity';
import { AtGuard } from 'src/auth/guards';
import { Role } from 'src/profiles/entities/profile.entity';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators';

@ApiTags('allotments')
@ApiBearerAuth()
@Controller('leave-allotment')
@UseGuards(AtGuard, RolesGuard)
export class LeaveAllotmentController {
  constructor(private readonly leaveAllotmentService: LeaveAllotmentService) {}

  @Roles(Role.HOD, Role.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new leave allotment',
    description: 'Creates a new leave allotment.',
  })
  @ApiResponse({
    status: 201,
    description: 'Leave allotment created successfully',
    type: Allotment,
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  create(@Body() createLeaveAllotmentDto: CreateLeaveAllotmentDto) {
    return this.leaveAllotmentService.create(createLeaveAllotmentDto);
  }

  @Roles(Role.FACULTY,Role.HOD, Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all leave allotments',
    description: 'Retrieves a list of all leave allotments.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter leave allotments by leave type',
    example: 'Sick Leave',
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
    description: 'List of leave allotments',
    type: [Allotment],
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
    return this.leaveAllotmentService.findall(search, page, limit);
  }

  @Roles(Role.FACULTY, Role.HOD, Role.ADMIN)
  @Get(':allotment_id')
  @ApiOperation({
    summary: 'Get leave allotment by ID',
    description: 'Retrieves a leave allotment by its ID.',
  })
  @ApiParam({
    name: 'allotment_id',
    required: true,
    description: 'ID of the leave allotment to retrieve',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Leave allotment found',
    type: Allotment,
  })
  @ApiNotFoundResponse({ description: 'Leave allotment not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  findOne(@Param('allotment_id', ParseIntPipe) id: number) {
    return this.leaveAllotmentService.findone(id);
  }

  @Roles(Role.HOD, Role.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update leave allotment details',
    description: 'Updates the details of a leave allotment.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the leave allotment to update',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Leave allotment details updated successfully',
    type: Allotment,
  })
  @ApiNotFoundResponse({ description: 'Leave allotment not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveAllotmentDto: UpdateLeaveAllotmentDto,
  ) {
    (updateLeaveAllotmentDto as any).allotment_id = id;
    return this.leaveAllotmentService.update(id, updateLeaveAllotmentDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a leave allotment',
    description: 'Deletes a leave allotment.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the leave allotment to delete',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Leave allotment deleted successfully',
    type: Allotment,
  })
  @ApiNotFoundResponse({ description: 'Leave allotment not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaveAllotmentService.remove(id);
  }
}
