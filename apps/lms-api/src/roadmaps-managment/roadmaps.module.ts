import { DynamicModule, Module, forwardRef } from '@nestjs/common';
import { RoadmapsService } from './roadmaps.service';
import { RoadmapsResolver } from './roadmaps.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Roadmap, RoadmapEdge, RoadmapNode } from './entities/roadmap.entity';
import { RoadmapsAdminResolver } from './roadmaps.admin.resolver';
import { TutorialsModule } from '../tutorials-management/tutorials.module';
export * from './entities/roadmap.entity';

@Module({
  providers: [RoadmapsResolver, RoadmapsService, RoadmapsAdminResolver],
  imports: [
    TypeOrmModule.forFeature([Roadmap, RoadmapNode, RoadmapEdge]),
    forwardRef(() => TutorialsModule),
  ],
})
export class RoadmapsModule {}
