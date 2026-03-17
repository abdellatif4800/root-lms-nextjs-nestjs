import { forwardRef, Module } from '@nestjs/common';
import { ProgressService } from './progress.service';
import { ProgressResolver } from './progress.resolver';
import { UnitProgress } from './entities/progress.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TutorialsModule } from '../tutorials-management/tutorials.module';
import { Unit } from '../tutorials-management/entities/tutorial.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([UnitProgress]),
    forwardRef(() => TutorialsModule),
  ],
  providers: [ProgressResolver, ProgressService],
})
export class ProgressModule {}
