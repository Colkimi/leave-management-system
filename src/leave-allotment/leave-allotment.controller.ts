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
import { LeaveAllotmentService } from './leave-allotment.service';
import { CreateLeaveAllotmentDto } from './dto/create-leave-allotment.dto';
import { UpdateLeaveAllotmentDto } from './dto/update-leave-allotment.dto';

@Controller('leave-allotment')
export class LeaveAllotmentController {
  constructor(private readonly leaveAllotmentService: LeaveAllotmentService) {}

  @Post()
  create(@Body() createLeaveAllotmentDto: CreateLeaveAllotmentDto) {
    return this.leaveAllotmentService.create(createLeaveAllotmentDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.leaveAllotmentService.findall(search);
  }

  @Get(':allotment_id')
  findOne(@Param('allotment_id', ParseIntPipe) id: number) {
    return this.leaveAllotmentService.findone(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLeaveAllotmentDto: UpdateLeaveAllotmentDto,
  ) {
    (updateLeaveAllotmentDto as any).admin_id = id;
    return this.leaveAllotmentService.update(id, updateLeaveAllotmentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaveAllotmentService.remove(id);
  }
}
