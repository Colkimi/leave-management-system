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
  Req,
  ForbiddenException,
} from '@nestjs/common';
import { LeaveApplicationService } from './leave-application.service';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';
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
import { Application, LeaveType } from './entities/leave-application.entity';
import { AtGuard } from 'src/auth/guards';
import { Role } from 'src/profiles/entities/profile.entity';
import { RolesGuard } from 'src/auth/guards/role.guard';
import { Roles } from 'src/auth/decorators';
import { Request } from 'express';

@ApiTags('applications')
@ApiBearerAuth()
@Controller('leave-application')
@UseGuards(AtGuard, RolesGuard)
export class LeaveApplicationController {
  constructor(
    private readonly leaveApplicationService: LeaveApplicationService,
  ) { }

@Roles(Role.FACULTY, Role.HOD, Role.ADMIN)
@Post()
@ApiOperation({
  summary: 'Create a new leave application',
  description: 'Creates a new leave application.',
})
@ApiResponse({
  status: 201,
  description: 'Leave application created successfully',
  type: Application,
})
@ApiBadRequestResponse({ description: 'Invalid request' })
@ApiUnauthorizedResponse({ description: 'Authentication required' })
@ApiForbiddenResponse({
  description: 'You do not have permissions to access this resource.',
})
create(
  @Body() createLeaveApplicationDto: CreateLeaveApplicationDto,
  @Req() req: Request,
) {
const user = req.user as { role: Role };

if (user.role === Role.FACULTY && 'status' in createLeaveApplicationDto) {
  throw new ForbiddenException('Faculty members cannot set status manually.');
}

if (user.role === Role.FACULTY) {
  createLeaveApplicationDto.status = 'Pending';
}

  return this.leaveApplicationService.create(createLeaveApplicationDto);
}

  @Roles(Role.HOD, Role.ADMIN, Role.FACULTY)
  @Get()
  @ApiOperation({
    summary: 'Get all leave applications',
    description: 'Retrieves a list of all leave applications.',
  })

 @ApiQuery({
   name: 'leave_type',
  enum: LeaveType,
  required: false,
  default: 'casual',
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
    description: 'List of leave applications',
    type: [Application],
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.leaveApplicationService.findall( page, limit);
  }

  @Roles(Role.HOD, Role.ADMIN, Role.FACULTY)
  @Get(':leave_id')
  @ApiOperation({
    summary: 'Get leave application by ID',
    description: 'Retrieves a leave application by its ID.',
  })
  @ApiParam({
    name: 'leave_id',
    required: true,
    description: 'ID of the leave application to retrieve',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Leave application found',
    type: Application,
  })
  @ApiNotFoundResponse({ description: 'Leave application not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  findOne(@Param('leave_id', ParseIntPipe) id: number) {
    return this.leaveApplicationService.findone(id);
  }

  @Roles(Role.ADMIN,Role.HOD,Role.FACULTY)
  @Patch(':id')
  @ApiOperation({
    summary: 'Update leave application details',
    description: 'Updates the details of a leave application.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the leave application to update',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Leave application details updated successfully',
    type: Application,
  })
  @ApiNotFoundResponse({ description: 'Leave application not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveApplicationDto: UpdateLeaveApplicationDto,
    @Req() req: Request,
  ) {

   const user = req.user as { role: Role };
    if (user && user.role === Role.FACULTY && updateLeaveApplicationDto.status) {
      throw new ForbiddenException(
        'Faculty members are not allowed to change the leave application status.',
      );
    }
    (updateLeaveApplicationDto as any).leave_id = id;
    return this.leaveApplicationService.update(id, updateLeaveApplicationDto);
  }

  @Roles(Role.HOD, Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Delete a leave application',
    description: 'Deletes a leave application.',
  })
  @ApiParam({
    name: 'id',
    required: true,
    description: 'ID of the leave application to delete',
    type: Number,
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Leave application deleted successfully',
    type: Application,
  })
  @ApiNotFoundResponse({ description: 'Leave application not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'You do not have permissions to access this resource.',
  })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaveApplicationService.remove(id);
  }
}
