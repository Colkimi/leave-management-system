
import { Controller, Get, Post, Body, Query, Param, Patch, Delete, ParseIntPipe } from '@nestjs/common';
import { CreateFacultyDto } from './dto/create-faculty.dto';
import { UpdateFacultyDto } from './dto/update-faculty.dto';
import { FacultyService } from './faculty.service';

@Controller('faculty')
export class FacultyController {
  constructor(private readonly facultyService: FacultyService) {}

  @Post()
  create(@Body() createFacultyDto: CreateFacultyDto) {
    return this.facultyService.create(createFacultyDto);
  }

  @Get()
  findAll(@Query('search') search?: string) {
    return this.facultyService.findall(search);
  }

  @Get(':faculty_id')
  findOne(@Param('faculty_id', ParseIntPipe) id: number) {
    return this.facultyService.findone(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateFacultyDto: UpdateFacultyDto,
  ) {
    (updateFacultyDto as any).admin_id = id;
    return this.facultyService.update(id, updateFacultyDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.facultyService.remove(id);
  }
}