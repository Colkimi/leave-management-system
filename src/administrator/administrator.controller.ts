import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Param,
  Patch,
  Delete,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { CreateAdministratorDto } from './dto/create-administrator.dto';
import { UpdateAdministratorDto } from './dto/update-administrator.dto';
import { AdministratorService } from './administrator.service';
import { Public } from '../auth/decorators/public.decorator';
import { AtGuard} from 'src/auth/guards';
import { Roles } from 'src/auth/decorators';
import { Administrator } from './entities/administrator.entity';
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
import { Role } from 'src/profiles/entities/profile.entity'; 
import { RolesGuard } from 'src/auth/guards/role.guard';

@ApiTags('admins')
@ApiBearerAuth()
@Controller('admin')
@UseGuards(AtGuard, RolesGuard)
export class AdministratorController {
  constructor(private readonly administratorService: AdministratorService) { }

  @Public()
  @Post()
  @ApiOperation({
    summary: 'creates a new admin',
    description:
      'Creates a new admin with the provided details. Requires ADMIN role',
  })
  @ApiResponse({
    status: 201,
    description: 'Admin created successfully',
    type: Administrator,
  })
  @ApiBadRequestResponse({ description: 'invalid request' })
  @ApiUnauthorizedResponse({ description: 'Admin authentication required' })
  @ApiForbiddenResponse({
    description:
      'You do not have permissions to access this resource. Admin role required',
  })
  create(@Body() createAdministratorDto: CreateAdministratorDto) {
    return this.administratorService.create(createAdministratorDto);
  }

  @ApiQuery({
    name: 'search',
    description: 'search admin',
    required: false,
  })
  @Roles(Role.ADMIN)
  @Get()
  @ApiOperation({
    summary: 'Get all admins',
    description:
      'Retrieves a list of all admins. Supports filtering by name. Requires ADMIN role.',
  })
  @ApiQuery({
    name: 'username',
    required: false,
    description: 'Filter admins by username',
    example: 'admin1',
  })
  @ApiResponse({
    status: 200,
    description: 'List of admins',
    type: [Administrator],
  })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({
    description: 'Unauthorized to access this resource. Requires ADMIN role.',
  })
  findAll(@Query('search') search?: string) {
    return this.administratorService.findall(search);
  }

  @Roles(Role.ADMIN)
  @Get(':id')
  @ApiOperation({
    summary: 'Get admin by ID',
    description: 'Retrieves admin by their id. Can only be accessed by admin.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'admin ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Admin found',
    type: Administrator,
  })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Requires relevant permissions' })
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.administratorService.findone(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  @ApiOperation({
    summary: 'update admin details',
    description: 'Updates the admin details. Can only be accessed by admin.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'admin ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Admin entry successfully updated',
    type: Administrator,
  })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Requires relevant permissions' })
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAdministratorDto: UpdateAdministratorDto,
  ) {
    (updateAdministratorDto as any).admin_id = id;
    return this.administratorService.update(id, updateAdministratorDto);
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  @ApiOperation({
    summary: 'Remove admin from database',
    description: 'Removes an admin entry. Can only be done by admin.',
  })
  @ApiParam({
    name: 'id',
    type: 'number',
    description: 'admin ID',
    example: 1,
  })
  @ApiResponse({
    status: 200,
    description: 'Admin entry successfully removed from database',
    type: Administrator,
  })
  @ApiNotFoundResponse({ description: 'Admin not found' })
  @ApiUnauthorizedResponse({ description: 'Authentication required' })
  @ApiForbiddenResponse({ description: 'Requires relevant permissions' })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.administratorService.remove(id);
  }
}
