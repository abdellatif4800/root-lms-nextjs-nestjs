import { DynamicModule, Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { FileStorageController } from './file-storage.controller';
import { ConfigService } from '@nestjs/config';
// import { MINIO_TOKEN } from '../common/decorators/minio.decorator';
import * as Minio from 'minio';

@Module({
  exports: [
    FileStorageService,
    //  MINIO_TOKEN
  ],
  imports: [],
  controllers: [FileStorageController],
  providers: [
    FileStorageService,
    FileStorageController,
    // {
    //   inject: [ConfigService],
    //   provide: MINIO_TOKEN,
    //   useFactory: (configService: ConfigService): Minio.Client => {
    //     return new Minio.Client({
    //       endPoint: configService.getOrThrow('MINIO_ENDPOINT'),
    //       port: configService.getOrThrow('MINIO_PORT'),
    //       accessKey: configService.getOrThrow('MINIO_ACCESS_KEY'),
    //       secretKey: configService.getOrThrow('MINIO_SECRET_KEY'),
    //       useSSL: false,
    //     });
    //   },
    // },
  ],
})
export class FileStorageModule {}
