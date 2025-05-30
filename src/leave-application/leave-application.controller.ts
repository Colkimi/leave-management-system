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
} from '@nestjs/common';
import { LeaveApplicationService } from './leave-application.service';
import { CreateLeaveApplicationDto } from './dto/create-leave-application.dto';
import { UpdateLeaveApplicationDto } from './dto/update-leave-application.dto';

@Controller('leave-application')
export class LeaveApplicationController {
  constructor(
    private readonly leaveApplicationService: LeaveApplicationService,
  ) {}

  @Post()
  create(@Body() createLeaveApplicationDto: CreateLeaveApplicationDto) {
    return this.leaveApplicationService.create(createLeaveApplicationDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.leaveApplicationService.findall(search);
  }

  @Get(':leave_id')
  findOne(@Param('leave_id', ParseIntPipe) id: number) {
    return this.leaveApplicationService.findone(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveApplicationDto: UpdateLeaveApplicationDto,
  ) {
    (updateLeaveApplicationDto as any).admin_id = id;
    return this.leaveApplicationService.update(id, updateLeaveApplicationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaveApplicationService.remove(id);
  }
}
