import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UnitProgress } from './entities/progress.entity';
import {
  CreateTutorialProgressInput,
  CreateUnitProgressInput,
} from './dto/create-progress.input';
import {
  UpdateTutorialProgressInput,
  UpdateUnitProgressInput,
} from './dto/update-progress.input';
import { Unit } from '../tutorials-management/entities/tutorial.entity';
import { TutorialsService } from '../tutorials-management/tutorials.service';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(UnitProgress)
    private unitProgressRepo: Repository<UnitProgress>,
    @Inject(forwardRef(() => TutorialsService))
    private tutorialsService: TutorialsService,
  ) {}

  async createUnitProgress(createUnitProgressInput: CreateUnitProgressInput) {
    const existing = await this.unitProgressRepo.findOne({
      where: {
        userId: createUnitProgressInput.userId,
        unitId: createUnitProgressInput.unitId,
      },
    });

    if (existing) {
      return await this.unitProgressRepo.save({
        ...existing,
        ...createUnitProgressInput,
      });
    }

    const newProgress = this.unitProgressRepo.create({
      userId: createUnitProgressInput.userId,
      unitId: createUnitProgressInput.unitId,
      isCompleted: createUnitProgressInput.isCompleted || false,
    });

    return await this.unitProgressRepo.save(newProgress);
  }

  async findAllUnitProgress() {
    return await this.unitProgressRepo.find({
      relations: ['user', 'unit'],
    });
  }

  async findOneUnitProgress(id: string) {
    const progress = await this.unitProgressRepo.findOne({
      where: { id },
      relations: ['user', 'unit'],
    });

    if (!progress) {
      throw new NotFoundException(`Unit progress with ID ${id} not found`);
    }

    return progress;
  }

  async updateUnitProgress(
    id: string,
    updateUnitProgressInput: UpdateUnitProgressInput,
  ) {
    const progress = await this.findOneUnitProgress(id);

    Object.assign(progress, updateUnitProgressInput);

    return await this.unitProgressRepo.save(progress);
  }

  async findUnitProgressByUserId(userId: string) {
    return await this.unitProgressRepo.find({
      where: { userId },
      relations: ['user', 'unit'],
    });
  }

  async findUnitProgressByTutorialAndUser(userId: string, tutorialId: string) {
    // Step 1: Get units of the tutorial via TutorialsService
    const units = await this.tutorialsService.getUnitsByTutorialId(tutorialId);

    if (!units || units.length === 0) {
      return [];
    }

    const unitIds = units.map((u) => u.id);

    // Step 2: Fetch user's progress for these units
    return await this.unitProgressRepo.find({
      where: {
        userId,
        unitId: In(unitIds),
      },
      relations: ['user', 'unit'],
      order: {
        unit: {
          order: 'ASC', // optional: order by unit order
        },
      },
    });
  }

  async findTutorialsWithProgressByUser(userId: string) {
    // 1️⃣ Get all unit progress for the user
    const userUnitProgress = await this.unitProgressRepo.find({
      where: { userId },
      relations: ['unit'],
    });

    if (!userUnitProgress.length) return [];

    // 2️⃣ Collect unique tutorial IDs from the units
    const tutorialIds = Array.from(
      new Set(userUnitProgress.map((p) => p.unit.tutorialId)),
    );

    // 3️⃣ Fetch tutorial details from TutorialsService
    const tutorials = await Promise.all(
      tutorialIds.map((tutorialId) =>
        this.tutorialsService.findOne(tutorialId),
      ),
    );

    // 4️⃣ Optionally, include progress summary per tutorial
    const tutorialsWithProgress = tutorials.map((tutorial) => {
      const units = tutorial.units || [];
      const progressUnits = userUnitProgress.filter(
        (p) => p.unit.tutorialId === tutorial.id,
      );
      const completedCount = progressUnits.filter((p) => p.isCompleted).length;
      const percentage = units.length
        ? (completedCount / units.length) * 100
        : 0;

      return {
        id: tutorial.id,
        userId, // ✅ include the userId here
        tutorialId: tutorial.id,
        tutorial,
        percentage,
        currentUnitId: null, // optional
        isCompleted: completedCount === units.length,
        createdAt: new Date(),
        updatedAt: new Date(),
      };
    });

    return tutorialsWithProgress;
  }
}
