import { DynamicModule, forwardRef, Module } from '@nestjs/common';
import { TutorialsService } from './tutorials.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Unit, Tutorial } from './entities/tutorial.entity';
import { TutorialsAdminResolver } from './tutorials.admin.resolver';
import { TutorialsResolver } from './tutorials.resolver';
import { ProgressModule } from '../progress-managment/progress.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Tutorial, Unit]),
    forwardRef(() => ProgressModule),
  ],
  exports: [TutorialsService],
  providers: [TutorialsService, TutorialsResolver, TutorialsAdminResolver],
})
export class TutorialsModule { }
