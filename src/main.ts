import { HttpAdapterHost, NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { AllExceptionsFilter } from './http-exception.filter';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe());

  const { httpAdapter } = app.get(HttpAdapterHost);
  // Register the global exception filter
  app.useGlobalFilters(new AllExceptionsFilter(httpAdapter));

  app.enableCors();

  const configService = app.get(ConfigService);
  const PORT = configService.getOrThrow<number>('PORT');
  const config = new DocumentBuilder()
    .setTitle('Leave management')
    .setDescription(
      `
     A leave Management System API

    A comprehensive REST API for managing employee leave requests, approvals, and organizational structure within an organization.
  
    - Leave Processing: Submit, approve, reject, and track leave applications
    - Leave allotment: An application gets an allotment id
    - Leave Allocation: Configure leave periods, balances, and adjustments
    - Leave history: Update leave history for leave tracking analytics

    This API provides comprehensive endpoints for managing:
    - Admin records
    - Leave applications and allotments
    - leave periods and adjustments
    - departments and designations
    - faculty members
  
     Authentication
  
    This API uses JWT Bearer tokens for authentication. To access protected endpoints:
  
    1. Login using the \`/auth/signin\` endpoint
    2. Use the returned \`accessToken\` in the Authorization header
    3. Format: \`Authorization: Bearer <your-token>\`
  
    Authorization

    The API uses role based authorization to authorize users

     Roles and Permissions
  
    - ADMINISTRATOR: Full access to all resources

    - FACULTY Can:
        Manage Profile : Faculty can view and edit their personal details.
        View Leave Status : Faculty can view the status of their leave applications.
        Send Leave Application : Faculty can apply for leave through the system.
        Load Adjustment : Faculty can request load adjustments (e.g., for absence due to leave).
        View Assigned Load : Faculty can view the load assigned to them

    - Faculty cannot create or update departments and designations
              cannot access administrator management endpoints
              cannot edit hod details
              cannot change the status of their leave application

    - HOD Can:
        Manage Profile : HOD can manage their personal details.
        View Leave Status : HOD can view the leave status of faculty members in their department.
        Send Leave Application : HOD can apply for leave on behalf of faculty (if necessary).
        Load Adjustment : HOD can approve or reject load adjustment requests.
        View Assigned Load : HOD can view the load assigned to all faculty members in the department.
        Leave Approval : HOD can approve or reject leave applications submitted by faculty members

    - HOD cannot create or update departments and designations
          cannot access administrator management endpoints  
  `,
    )
    .setVersion('1.0')
    .addTag('admins', 'use administrators endpoint')
    .addTag('departments', 'use departments endpoint')
    .addTag('designations', 'use designations endpoint')
    .addTag('faculty', 'use faculty endpoint')
    .addTag('allotments', 'use leave allotments endpoint')
    .addTag('applications', 'use leave applications endpoint')
    .addTag('history', 'use leave history endpoint')
    .addTag('adjustments', 'use leave adjustments endpoint')
    .addTag('hod', 'use head of departments endpoint')
    .addTag('auth', 'use authentication endpoint')
    .addTag('profile', 'use user profiles endpoint')
    .addTag('seed', 'seeding the database endpoint')
    .addBearerAuth()
    // .addApiKey({ type: 'apiKey', name: 'X-API-Key', in: 'header' }, 'api-key')
    .addServer('http://localhost:3000')
    .addServer('https://deployedapp.com')
    .setVersion('1.0')
    .setTermsOfService('https://university.com/terms')
    .setContact(
      'API Support',
      'https://ourcompany.com/support',
      'api-support@ourcomany.com',
    )
    .setLicense('MIT', 'https://opensource.org/licenses/MIT')
    .build();
  const documentFactory = () => {
    const document = SwaggerModule.createDocument(app, config);
    document.security = [{ 'access-token': [] }];
    return document;
  };

  SwaggerModule.setup('docs', app, documentFactory, {
    jsonDocumentUrl: '/docs-json',
    swaggerOptions: {
      persistAuthorization: true,
      tagsSorter: 'alpha',
      operationsSorter: 'alpha',
      docExpansion: 'none',
      filter: true,
      showRequestDuration: false,
    },
    customCss: `
  .swagger-ui .topbar { display:none }
  .swaggger-ui .info  { margin-bottom:25px }
  `,
    customSiteTitle: 'Leave management Api',
    customfavIcon:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTEthKcF9mPcr0VjEH0ILoQS_JywzjNrlrEIA&s',
  });
  await app.listen(PORT, () => {
    console.log(`Server is running on Port ${PORT}`);
  });
}
bootstrap();
