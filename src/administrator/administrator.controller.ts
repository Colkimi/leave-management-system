
import { Controller, Get, Post, Body, Query, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { AdministratorService } from './administrator.service';

@Controller('admin')
export class AdministratorController {
  constructor(private readonly administratorService: AdministratorService) {}

  @Post()
  create(@Body() createAdministratorDto: CreateAdministratorDto) {
    return this.administratorService.create(createAdministratorDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.administratorService.findall(search);
  }

  @Get(':admin_id')
  findOne(@Param('admin_id', ParseIntPipe) id: number) {
    return this.administratorService.findone(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
  ) {
    (updateAdministratorDto as any).admin_id = id;
    return this.administratorService.update(id, updateAdministratorDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.administratorService.remove(id);
  }
}