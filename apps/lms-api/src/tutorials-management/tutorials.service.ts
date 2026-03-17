import { Inject, Injectable } from '@nestjs/common';
import { CreateTutorialInput } from './dto/create-tutorial.input';
import { UpdateTutorialInput } from './dto/update-tutorial.input';
import { log } from 'console';
import { InjectRepository } from '@nestjs/typeorm';
import { Tutorial, Unit } from './entities/tutorial.entity';
import { Repository } from 'typeorm';
import { FilterTutorialInput } from './dto/filter-tutorial.input';
import { TutorialType } from './entities/tutorial.graphqlTypes';

@Injectable()
export class TutorialsService {
  constructor(
    @InjectRepository(Tutorial)
    private tutorialRepo: Repository<Tutorial>,
    @InjectRepository(Unit)
    private unitRepo: Repository<Unit>,
  ) { }

  async create(createTutorialInput: CreateTutorialInput) {
    const newTutorial = this.tutorialRepo.create({
      ...createTutorialInput,
      createdAt: new Date(),
      publish: false,
      units: createTutorialInput.units?.map((unit) => ({
        ...unit,
        createdAt: new Date(),
        publish: false,
      })),
    });
    log(newTutorial);
    // return 123;
    return await this.tutorialRepo.save(newTutorial);
  }

  async findAll(filters?: FilterTutorialInput): Promise<TutorialType[]> {
    const qb = this.tutorialRepo
      .createQueryBuilder('tutorial')
      .leftJoinAndSelect('tutorial.units', 'unit')
      .leftJoinAndSelect('tutorial.author', 'author');

    if (filters?.publish !== undefined && filters?.publish !== null) {
      qb.andWhere('tutorial.publish = :publish', { publish: filters.publish });
    }

    if (filters?.authorId) {
      qb.andWhere('tutorial.authorId = :authorId', {
        authorId: filters.authorId,
      });
    }

    if (filters?.levels?.length) {
      qb.andWhere('tutorial.level IN (:...levels)', { levels: filters.levels });
    }

    if (filters?.tutorialName) {
      qb.andWhere('tutorial.tutorialName ILIKE :tutorialName', {
        tutorialName: `%${filters.tutorialName}%`,
      });
      // ILIKE for case-insensitive partial match (Postgres)
    }
    if (filters?.categories?.length) {
      qb.andWhere('tutorial.category IN (:...categories)', {
        categories: filters.categories,
      });
    }

    if (filters?.createdAfter) {
      qb.andWhere('tutorial.createdAt >= :createdAfter', {
        createdAfter: filters.createdAfter,
      });
    }

    if (filters?.createdBefore) {
      qb.andWhere('tutorial.createdAt <= :createdBefore', {
        createdBefore: filters.createdBefore,
      });
    }

    // Order
    qb.orderBy('tutorial.createdAt', 'DESC').addOrderBy('unit.order', 'ASC');

    return qb.getMany();
  }

  async findOne(id: string): Promise<TutorialType> {
    const tutorial = await this.tutorialRepo
      .createQueryBuilder('tutorial')
      .where('tutorial.id=:id', { id: id })
      .leftJoinAndSelect('tutorial.units', 'unit')
      .leftJoinAndSelect('tutorial.author', 'author')
      .orderBy('tutorial.createdAt', 'DESC')
      .addOrderBy('unit.order', 'ASC')
      .getOne();

    if (!tutorial) {
      throw new Error(`Tutorial with id ${id} not found`);
    }

    const unitsTitlesList: string[] =
      tutorial.units
        ?.map((unit) => unit.unitTitle)
        .filter((title): title is string => !!title) || [];

    return { ...tutorial, unitsTitlesList };
  }

  async getUnitsByTutorialId(tutorialId: string): Promise<Unit[]> {
    return this.unitRepo.find({
      where: { tutorialId },
      order: { order: 'ASC' },
    });
  }

  async findUnitById(id: string): Promise<Unit | null> {
    const unit = await this.unitRepo.findOne({
      where: { id },
      relations: ['tutorial'],
    });

    if (!unit) {
      throw new Error(`Unit with id ${id} not found`);
    }

    return unit;
  }

  async update(id: string, updateTutorialInput: UpdateTutorialInput) {
    const tutorial: any = await this.tutorialRepo.preload({
      ...updateTutorialInput,
    });

    if (!tutorial) {
      throw new Error(`Tutorial with id ${id} not found`);
    }

    return this.tutorialRepo.save(tutorial);
  }

  remove(id: string) {
    return `This action removes a #${id} tutorial`;
  }
}
