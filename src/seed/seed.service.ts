import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, DataSource, Admin } from 'typeorm';
import { faker } from '@faker-js/faker';
import { Administrator } from '../administrator/entities/administrator.entity';
import { Department } from 'src/department/entities/department.entity';
import { Designation } from 'src/designation/entities/designation.entity';
import { Faculty } from 'src/faculty/entities/faculty.entity';
import { Allotment } from 'src/leave-allotment/entities/leave-allotment.entity';
import { Application } from 'src/leave-application/entities/leave-application.entity';
import { History } from 'src/leave-history/entities/leave-history.entity';
import { LoadAdjustment } from 'src/load-adjustment/entities/load-adjustment.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class SeedService {
  private readonly logger = new Logger(SeedService.name);

  constructor(
    @InjectRepository(Administrator)
    private readonly administratorRepository: Repository<Administrator>,
    @InjectRepository(Department)
    private readonly departmentRepository: Repository<Department>,
    @InjectRepository(Designation)
    private readonly designationRepository: Repository<Designation>,
    @InjectRepository(Faculty)
    private readonly facultyRepository: Repository<Faculty>,
    @InjectRepository(Allotment)
    private readonly allotmentRepository: Repository<Allotment>,
    @InjectRepository(Application)
    private readonly applicationRepository: Repository<Application>,
    @InjectRepository(History)
    private readonly historyRepository: Repository<History>,
    @InjectRepository(LoadAdjustment)
    private readonly adjustmentRepository: Repository<LoadAdjustment>,
    private readonly dataSource: DataSource,
  ) {}

  async seed() {
    this.logger.log('Starting the seeding process...');

    try {
      await this.clearTables();
      const administrator: Administrator[] = [];
      const departments: Department[] = [];
      const designations: Designation[] = [];
      const faculties: Faculty[] = [];
      const allotments: Allotment[] = [];
      const applications: Application[] = [];
      const histories: History[] = [];
      const adjustments: LoadAdjustment[] = [];

      await this.seedAdministrator(administrator);
      await this.seedDepartments(departments);
      await this.seedDesignations(designations);
      await this.seedFaculties(faculties);
      await this.seedAllotments(allotments);
      await this.seedApplications(applications);
      await this.seedLeaveHistory(histories);
      await this.seedLoadAdjustments(adjustments);

      this.logger.log('Seeding completed successfully');
      return { message: 'Database seeded successfully' };
    } catch (error) {
      this.logger.error('Error during seeding:', error);
      throw error;
    }
  }

  private async hashPassword(password: string): Promise<string> {
    const salt = await bcrypt.genSalt(10);
    return bcrypt.hash(password, salt);
  }

  private async seedAdministrator(administrator: Administrator[]) {
    this.logger.log('Seeding administrators...');
    const admins: Administrator[] = [];
    const adminData = [
      {
        username: 'admin',
        password: 'admin123',
        email: 'admin@university.edu',
        role: 'System Administrator',
      },
    ];

    for (const data of adminData) {
      const admin = new Administrator();
      admin.username = data.username;
      admin.password = await this.hashPassword(data.password); // Hash the password
      admin.email = data.email;
      admin.role = data.role;
      admins.push(await this.administratorRepository.save(admin));
    }
    this.logger.log(`Created ${admins.length} administrators`);
    return administrator;
  }

  private async clearTables() {
    this.logger.log('Clearing existing data...');

    // Using QueryRunner for transaction support
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      await queryRunner.query('TRUNCATE TABLE application RESTART IDENTITY CASCADE');
      await queryRunner.query('TRUNCATE TABLE allotment RESTART IDENTITY CASCADE');

      await queryRunner.query('TRUNCATE TABLE faculty RESTART IDENTITY CASCADE');
      await queryRunner.query('TRUNCATE TABLE designation RESTART IDENTITY CASCADE');
      await queryRunner.query('TRUNCATE TABLE department RESTART IDENTITY CASCADE');
      await queryRunner.query('TRUNCATE TABLE administrator RESTART IDENTITY CASCADE');
      await queryRunner.query('TRUNCATE TABLE history RESTART IDENTITY CASCADE');
      await queryRunner.query('TRUNCATE TABLE load_adjustment RESTART IDENTITY CASCADE');


      await queryRunner.commitTransaction();
      this.logger.log('All tables cleared successfully');
    } catch (err) {
      await queryRunner.rollbackTransaction();
      this.logger.error('Failed to clear tables', err);
      throw err;
    } finally {
      await queryRunner.release();
    }
  }

  private async seedDepartments(departments: Department[]) {
    this.logger.log('Seeding departments...');
    const departmentNames = [
      'ICT',
      'Finance',
      'Marketing',
      'Sales',
      'Production',
      'Business Administration',
      'Customer service',
      'Training and Development',
    ];

    for (const name of departmentNames) {
      const department = new Department();
      department.department_name = name;
      departments.push(await this.departmentRepository.save(department));
    }
    this.logger.log(`Created ${departments.length} departments`);
    return departments;
  }

  private async seedAllotments(allotments: Allotment[]) {
    this.logger.log('Seeding allotments...');
    const leaveType = [
      'Sick',
      'Casual',
      'Unpaid',
      'Annual',
      'Sabbatical',
      'Violence',
      'Holiday',
      'Adoption',
    ];
    const faculties = await this.facultyRepository.find();

    for (const type of leaveType) {
      const allotment = new Allotment();
      allotment.leave_type = type;
      allotment.total_days = faker.number.int({ min: 5, max: 30 });
      allotment.remaining_days = faker.number.int({
        min: 0,
        max: allotment.total_days,
      });
      // Assign a faculty to avoid null faculty_id error
      allotment.faculty = faker.helpers.arrayElement(faculties);
      allotments.push(await this.allotmentRepository.save(allotment));
    }
    this.logger.log(`Created ${allotments.length} leave allotments`);
    return allotments;
  }

  private async seedDesignations(designations: Designation[]) {
    this.logger.log('Seeding designations...');
    const designation: Designation[] = [];
    const designationTitles = [
      'Chief Executive Officer',
      'Chief Financial Officer',
      'Sales Manager',
      'Administrative assistant',
      'Assistant Manager',
      'Customer service representative',
      'Coordinator',
      'Marketing Coordinator',
      'Director',
      'Manager',
      'Supervisor',
    ];

    for (const title of designationTitles) {
      const facultyEntity = new Designation();
      facultyEntity.designation_name = title;

      designation.push(await this.designationRepository.save(facultyEntity));
    }
    this.logger.log(`Created ${designation.length} designations`);
    return designations;
  }

  private async seedFaculties(faculties: Faculty[]) {
    this.logger.log('Seeding faculties...');
    const facultyTitles = [
      'Administration',
      'Human Resources',
      'Research & Development',
      'Operations management',
      'Accounting',
      'Leadership',
      'Projects',
      'Designing',
      'Business',
      'Recruitment',
      'Human Resource',
    ];
    const departments = await this.departmentRepository.find();
    const designations = await this.designationRepository.find();

    for (const title of facultyTitles) {
      const facultyEntity = new Faculty();
      facultyEntity.faculty_name = title;
      facultyEntity.first_name = faker.person.firstName();
      facultyEntity.last_name = faker.person.lastName();
      facultyEntity.email = faker.internet.email();
      facultyEntity.phone = faker.phone.number();
      facultyEntity.status = 'active';
      // Assign department and designation to avoid null foreign keys
      facultyEntity.department = faker.helpers.arrayElement(departments);
      facultyEntity.designation = faker.helpers.arrayElement(designations);
      faculties.push(await this.facultyRepository.save(facultyEntity));
    }
    this.logger.log(`Created ${faculties.length} faculties`);
    return faculties;
  }
  private async seedApplications(applications: Application[]) {
    this.logger.log('Seeding administrators...');
    const leaveData = [
      { leave_type: 'Sick', status: 'active' },
      { leave_type: 'Casual', status: 'inactive' },
      { leave_type: 'Unpaid', status: 'active' },
      { leave_type: 'Annual', status: 'inactive' },
      { leave_type: 'Sabbatical', status: 'active' },
      { leave_type: 'Violence', status: 'inactive' },
      { leave_type: 'Holiday', status: 'active' },
      { leave_type: 'Adoption', status: 'inactive' },
    ];
    const faculties = await this.facultyRepository.find();
    const administrators = await this.administratorRepository.find();
    let allotments = await this.allotmentRepository.find();

    // Shuffle allotments to assign uniquely
    allotments = allotments.sort(() => Math.random() - 0.5);

    for (let i = 0; i < leaveData.length; i++) {
      const data = leaveData[i];
      const application = new Application();
      application.leave_type = data.leave_type;
      application.status = data.status;
      application.start_date = faker.date.future();
      application.end_date = faker.date.future({
        years: 1,
        refDate: application.start_date,
      });
      application.reason = faker.lorem.sentence();
      application.faculty = faker.helpers.arrayElement(faculties);

      // Assign unique allotment if available
      if (i < allotments.length) {
        application.allotment = allotments[i];
      } else {
        // To satisfy type, assign a new Allotment or handle differently
        // Here, we create a dummy allotment or skip assigning
        // For now, skip assigning allotment to avoid null assignment error
        // application.allotment = null;
      }

      // Assign an administrator to approvedBy to avoid null error
      application.approvedBy = faker.helpers.arrayElement(administrators);

      applications.push(await this.applicationRepository.save(application));
    }
    this.logger.log(`Created ${applications.length} applications`);
    return applications;
  }

  private async seedLeaveHistory(histories: History[]) {
    this.logger.log('Seeding leave history...');
    const faculties = await this.facultyRepository.find();
    const applications = await this.applicationRepository.find();
    const leaveTypes = [
      'Sick',
      'Casual',
      'Unpaid',
      'Annual',
      'Sabbatical',
      'Violence',
      'Holiday',
      'Adoption',
    ];
    for (let i = 0; i < 10; i++) {
      const history = new History();
      history.leave_type = faker.helpers.arrayElement(leaveTypes);
      history.start_date = faker.date.past();
      history.end_date = faker.date.future({
        years: 1,
        refDate: history.start_date,
      });
      history.status = faker.helpers.arrayElement([
        'approved',
        'rejected',
        'pending',
      ]);
      // Assign a faculty to avoid null faculty_id error
      history.faculty = faker.helpers.arrayElement(faculties);
      // Assign an application to avoid null leave_id error
      history.application = faker.helpers.arrayElement(applications);
      histories.push(await this.historyRepository.save(history));
    }
    this.logger.log(`Created ${histories.length} leave history records`);
    return histories;
  }

  private async seedLoadAdjustments(loadAdjustments: LoadAdjustment[]) {
    this.logger.log('Seeding load adjustments...');
    const faculties = await this.facultyRepository.find();
    const administrators = await this.administratorRepository.find();
    const departments = await this.departmentRepository.find();
    const designations = await this.designationRepository.find();
    const allotments = await this.allotmentRepository.find();
    const histories = await this.historyRepository.find();
    const applications = await this.applicationRepository.find();

    for (let i = 0; i < 10; i++) {
      const adjustment = new LoadAdjustment();
      adjustment.adjustment_type = faker.helpers.arrayElement([
        'increase',
        'decrease',
      ]);
      adjustment.adjustment_hours = faker.number.int({ min: 1, max: 8 });
      adjustment.status = faker.helpers.arrayElement([
        'approved',
        'pending',
        'rejected',
      ]);
      adjustment.faculty = faker.helpers.arrayElement(faculties);
      // Assign related entities to avoid null foreign keys
      adjustment.administrator = faker.helpers.arrayElement(administrators);
      adjustment.department = faker.helpers.arrayElement(departments);
      adjustment.designation = faker.helpers.arrayElement(designations);
      adjustment.allotment = faker.helpers.arrayElement(allotments);
      adjustment.history = faker.helpers.arrayElement(histories);
      adjustment.application = faker.helpers.arrayElement(applications);
      loadAdjustments.push(await this.adjustmentRepository.save(adjustment));
    }
    this.logger.log(
      `Created ${loadAdjustments.length} load adjustment records`,
    );
    return loadAdjustments;
  }
}
