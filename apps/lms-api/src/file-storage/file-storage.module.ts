import { DynamicModule, Module } from '@nestjs/common';
import { FileStorageService } from './file-storage.service';
import { FileStorageController } from './file-storage.controller';
import { MuxWebhookController } from './mux-webhook.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit } from '../tutorials-management/entities/tutorial.entity';

@Module({
  exports: [FileStorageService],
  imports: [TypeOrmModule.forFeature([Unit])],
  controllers: [FileStorageController, MuxWebhookController],
  providers: [FileStorageService, FileStorageController],
})
export class FileStorageModule {}
