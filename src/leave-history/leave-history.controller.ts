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
import { LeaveHistoryService } from './leave-history.service';
import { CreateLeaveHistoryDto } from './dto/create-leave-history.dto';
import { UpdateLeaveHistoryDto } from './dto/update-leave-history.dto';
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
import { History } from './entities/leave-history.entity';
import { AtGuard } from 'src/auth/guards';
import { Role } from 'src/profiles/entities/profile.entity';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators';
@ApiTags('history')
@ApiBearerAuth()
@Controller('leave-history')
@UseGuards(AtGuard, RolesGuard)
export class LeaveHistoryController {
  constructor(private readonly leaveHistoryService: LeaveHistoryService) {}

  @Roles(Role.HOD, Role.ADMIN)
  @Post()
  @ApiOperation({
    summary: 'Create a new leave history entry',
    description: 'Creates a new leave history entry.',
  })
  @ApiResponse({
    status: 201,
    description: 'Leave history entry created successfully',
    type: History,
  })
  @ApiBadRequestResponse({ description: 'Invalid request' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  create(@Body() createLeaveHistoryDto: CreateLeaveHistoryDto) {
    return this.leaveHistoryService.create(createLeaveHistoryDto);
  }

  @Roles(Role.HOD, Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all leave history entries',
    description: 'Retrieves a list of all leave history entries.',
  })
  @ApiQuery({
    name: 'search',
    required: false,
    description: 'Filter leave history entries by leave type or status',
    example: 'Sick',
  })
  @ApiResponse({
    status: 200,
    description: 'List of leave history entries',
    type: [History],
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  findAll(@Query('search') search?: string) {
    return this.leaveHistoryService.findall(search);
  }

  @Roles(Role.HOD, Role.ADMIN)
  @Get(':history_id')
  @ApiOperation({
    summary: 'Get leave history entry by ID',
    description: 'Retrieves a leave history entry by its ID.',
  })
  @ApiParam({
    name: 'history_id',
    required: true,
    description: 'ID of the leave history entry to retrieve',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Leave history entry found',
    type: History,
  })
  @ApiNotFoundResponse({ description: 'Leave history entry not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  findOne(@Param('history_id', ParseIntPipe) id: number) {
    return this.leaveHistoryService.findone(id);
  }

  @Roles(Role.HOD, Role.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update leave history entry details',
    description: 'Updates the details of a leave history entry.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the leave history entry to update',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Leave history entry details updated successfully',
    type: History,
  })
  @ApiNotFoundResponse({ description: 'Leave history entry not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveHistoryDto: UpdateLeaveHistoryDto,
  ) {
    (updateLeaveHistoryDto as any).admin_id = id;
    return this.leaveHistoryService.update(id, updateLeaveHistoryDto);
  }

  @Roles(Role.HOD, Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a leave history entry',
    description: 'Deletes a leave history entry.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the leave history entry to delete',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Leave history entry deleted successfully',
    type: History,
  })
  @ApiNotFoundResponse({ description: 'Leave history entry not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaveHistoryService.remove(id);
  }
}
