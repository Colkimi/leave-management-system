
import { Controller, Get, Post, Body, Query, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateDesignationDto } from './dto/create-designation.dto';
import { UpdateDesignationDto } from './dto/update-designation.dto';
import { DesignationService } from './designation.service';

@Controller('designation')
export class DesignationController {
  constructor(private readonly designationService: DesignationService) {}

  @Post()
  create(@Body() createDesignationDto: CreateDesignationDto) {
    return this.designationService.create(createDesignationDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.designationService.findall();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.designationService.findone(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() UpdateDesignationDto: UpdateDesignationDto,
  ) {
    (UpdateDesignationDto as any).designation_id = id;
    return this.designationService.update(id, UpdateDesignationDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.designationService.remove(id);
  }
}