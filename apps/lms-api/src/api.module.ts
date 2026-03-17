import { Module } from '@nestjs/common';
import { ApiController } from './api.controller';
import { ApiService } from './api.service';
import { ApolloDriverConfig, ApolloDriver } from '@nestjs/apollo';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { GraphQLModule } from '@nestjs/graphql';
import { TerminusModule } from '@nestjs/terminus';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorialsModule } from './tutorials-management/tutorials.module';
import { join } from 'path';
import { UsersModule } from './users-managment/users.module';
import { FileStorageModule } from './file-storage/file-storage.module';
import { ProgressModule } from './progress-managment/progress.module';
import { RoadmapsModule } from './roadmaps-managment/roadmaps.module';
import { PaymentManagementModule } from './payment-management/src/payment-management.module';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      context: ({ req, res }) => ({ req, res }),
      autoSchemaFile: process.env.VERCEL
        ? true
        : join(process.cwd(), './schema.gql'),

      sortSchema: true,
    }),

    //-----------------------------------

    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        // 1. Grab the URL using NestJS ConfigService
        let dbUrl =
          configService.get<string>('POSTGRES_URL') ||
          configService.get<string>('DATABASE_URL');

        // 2. Safely inject the compatibility flag to silence the pg-connection-string warning
        if (
          dbUrl &&
          dbUrl.includes('?sslmode=require') &&
          !dbUrl.includes('uselibpqcompat')
        ) {
          dbUrl = dbUrl.replace(
            '?sslmode=require',
            '?uselibpqcompat=true&sslmode=require',
          );
        }

        return {
          type: 'postgres',
          url: dbUrl, // Use the patched URL here
          autoLoadEntities: true,
          synchronize: true, // ⚠️ See note below about production
          ssl: {
            rejectUnauthorized: false, // Prevents Neon SSL handshake errors
          },
        };
      },
    }),
    //-----------------------------------

    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: '.env',
    }),

    //-----------------------------------

    TerminusModule,

    //-----------------------------------

    UsersModule,

    //-----------------------------------

    RoadmapsModule,

    //-----------------------------------

    TutorialsModule,

    //-----------------------------------

    ProgressModule,

    //-----------------------------------

    FileStorageModule,
    //-----------------------------------

    PaymentManagementModule,
  ],
  controllers: [ApiController],
  providers: [ApiService],
})
export class ApiModule {}
