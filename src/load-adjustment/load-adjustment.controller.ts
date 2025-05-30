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
import { LoadAdjustmentService } from './load-adjustment.service';
import { CreateLoadAdjustmentDto } from './dto/create-load-adjustment.dto';
import { UpdateLoadAdjustmentDto } from './dto/update-load-adjustment.dto';

@Controller('load-adjustment')
export class LoadAdjustmentController {
  constructor(private readonly loadAdjustmentService: LoadAdjustmentService) {}

  @Post()
  create(@Body() createLoadAdjustmentDto: CreateLoadAdjustmentDto) {
    return this.loadAdjustmentService.create(createLoadAdjustmentDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.loadAdjustmentService.findall(search);
  }

  @Get(':adjustment_id')
  findOne(@Param('adjustment_id', ParseIntPipe) id: number) {
    return this.loadAdjustmentService.findone(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoadAdjustmentDto: UpdateLoadAdjustmentDto,
  ) {
    (updateLoadAdjustmentDto as any).admin_id = id;
    return this.loadAdjustmentService.update(id, updateLoadAdjustmentDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.loadAdjustmentService.remove(id);
  }
}
