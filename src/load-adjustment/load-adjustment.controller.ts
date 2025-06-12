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
import { ApiBearerAuth, ApiQuery, ApiTags } from '@nestjs/swagger';
import { Roles } from 'src/auth/decorators';
import { Role } from 'src/profiles/entities/profile.entity';

@ApiTags('adjustments')
@ApiBearerAuth()
@Controller('load-adjustment')
export class LoadAdjustmentController {
  constructor(private readonly loadAdjustmentService: LoadAdjustmentService) {}

  @Roles(Role.HOD, Role.ADMIN)
  @Post()
  create(@Body() createLoadAdjustmentDto: CreateLoadAdjustmentDto) {
    return this.loadAdjustmentService.create(createLoadAdjustmentDto);
  }

  @ApiQuery({
      name: 'search',
      description: 'search adjustment',
      required: false,
    })
  @Roles(Role.HOD, Role.ADMIN, Role.FACULTY)
  @Get()
  findAll(@Query('search') search?: string) {
    return this.loadAdjustmentService.findall(search);
  }

  @Roles(Role.HOD, Role.ADMIN, Role.FACULTY)
  @Get(':adjustment_id')
  findOne(@Param('adjustment_id', ParseIntPipe) id: number) {
    return this.loadAdjustmentService.findone(id);
  }

  @Roles(Role.HOD, Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateLoadAdjustmentDto: UpdateLoadAdjustmentDto,
  ) {
    (updateLoadAdjustmentDto as any).adjustment_id = id;
    return this.loadAdjustmentService.update(id, updateLoadAdjustmentDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.loadAdjustmentService.remove(id);
  }
}
