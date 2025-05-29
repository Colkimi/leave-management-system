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
import { LeaveHistoryService } from './leave-history.service';
import { CreateLeaveHistoryDto } from './dto/create-leave-history.dto';
import { UpdateLeaveHistoryDto } from './dto/update-leave-history.dto';

@Controller('leave-history')
export class LeaveHistoryController {
  constructor(private readonly leaveHistoryService: LeaveHistoryService) {}

  @Post()
  create(@Body() createLeaveHistoryDto: CreateLeaveHistoryDto) {
    return this.leaveHistoryService.create(createLeaveHistoryDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.leaveHistoryService.findall(search);
  }

  @Get(':history_id')
  findOne(@Param('history_id', ParseIntPipe) id: number) {
    return this.leaveHistoryService.findone(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdministratorDto: UpdateLeaveHistoryDto,
  ) {
    (updateAdministratorDto as any).admin_id = id;
    return this.leaveHistoryService.update(id, updateAdministratorDto);
  }
  
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.leaveHistoryService.remove(id);
  }
}