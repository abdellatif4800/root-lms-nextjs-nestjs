import {
  Injectable,
  Inject,
  forwardRef,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoadmapInput } from './dto/create-roadmap.input';
import { UpdateRoadmapInput } from './dto/update-roadmap.input';
import { InjectRepository } from '@nestjs/typeorm';
import { Roadmap, RoadmapEdge, RoadmapNode } from './entities/roadmap.entity';
import { getRepository, Repository } from 'typeorm';
import { RoadmapType } from './entities/roadmap.graphqlTyes';
import { TutorialsService } from '../tutorials-management/tutorials.service';

@Injectable()
export class RoadmapsService {
  constructor(
    @InjectRepository(Roadmap)
    private roadmapRepo: Repository<Roadmap>,

    @InjectRepository(RoadmapNode)
    private roadmapNodeRepo: Repository<RoadmapNode>,

    @InjectRepository(RoadmapEdge)
    private roadmapEdgeRepo: Repository<RoadmapEdge>,

    @Inject(forwardRef(() => TutorialsService))
    private tutorialsService: TutorialsService,
  ) {}

  async createRoadmap(
    createRoadmapInput: CreateRoadmapInput,
  ): Promise<Roadmap> {
    const roadmap = this.roadmapRepo.create({
      title: createRoadmapInput.title,
      description: createRoadmapInput.description,
      authorId: createRoadmapInput.authorId,
    });
    return this.roadmapRepo.save(roadmap);
  }

  /** 2️⃣ Add a node to an existing roadmap */
  async addNode(
    roadmapId: string,
    tutorialId: string,
    positionX: number,
    positionY: number,
    clientId: string,
  ): Promise<RoadmapNode> {
    const node = this.roadmapNodeRepo.create({
      clientId,
      roadmapId,
      tutorialId,
      positionX,
      positionY,
    });
    return this.roadmapNodeRepo.save(node);
  }

  /** 3️⃣ Add an edge to an existing roadmap */
  async addEdge(
    roadmapId: string,
    sourceNodeId: string,
    targetNodeId: string,
  ): Promise<RoadmapEdge> {
    const edge = this.roadmapEdgeRepo.create({
      roadmapId,
      sourceNodeId,
      targetNodeId,
    });
    return this.roadmapEdgeRepo.save(edge);
  }

  /** Optional: get full roadmap with nodes and edges */
  async getRoadmapWithDetails(roadmapId: string) {
    const roadmap = await this.roadmapRepo.findOne({
      where: { id: roadmapId },
      relations: [
        'nodes',
        'nodes.tutorial',
        'edges',
        'edges.sourceNode',
        'edges.targetNode',
        'author',
      ],
    });
    if (!roadmap) return null;

    // 👇 Map clientIds onto edges
    roadmap.edges = roadmap.edges.map((edge) => ({
      ...edge,
      sourceClientId: edge.sourceNode?.clientId,
      targetClientId: edge.targetNode?.clientId,
    })) as any;

    return roadmap;
  }

  async getRoadmaps(): Promise<Roadmap[]> {
    return this.roadmapRepo.find({
      relations: ['nodes', 'edges', 'nodes.tutorial', 'author'],
    });
  }

  async getCounts() {
    return await this.roadmapRepo.count();
  }

  // ─── Paste this method into RoadmapsService ───────────────────────────────────

  async updateRoadmap(input: UpdateRoadmapInput): Promise<Roadmap | null> {
    const { id, title, description, nodes, edges } = input;

    // 1️⃣ Update scalar fields on the roadmap itself
    await this.roadmapRepo.update(
      { id },
      {
        ...(title !== undefined && { title }),
        ...(description !== undefined && { description }),
      },
    );

    // 2️⃣ Sync nodes
    const clientIdToRealId = new Map<string, string>();

    if (nodes !== undefined) {
      const existingNodes = await this.roadmapNodeRepo.find({
        where: { roadmapId: id },
      });
      const existingIds = new Set(existingNodes.map((n) => n.id));
      const incomingExistingIds = new Set(
        nodes.filter((n) => n.id).map((n) => n.id as string),
      );

      // ── Delete nodes removed from the list ───────────────────────────────
      const idsToDelete = [...existingIds].filter(
        (eid) => !incomingExistingIds.has(eid),
      );
      if (idsToDelete.length) {
        await this.roadmapEdgeRepo
          .createQueryBuilder()
          .delete()
          .where('sourceNodeId IN (:...ids) OR targetNodeId IN (:...ids)', {
            ids: idsToDelete,
          })
          .execute();
        await this.roadmapNodeRepo.delete(idsToDelete);
      }

      // ── Upsert every node in the incoming list ───────────────────────────
      for (const node of nodes) {
        // Resolve tutorialId from flat field OR nested tutorial object
        const tutorialId = node.tutorialId ?? node.tutorial?.id;
        if (!tutorialId) {
          throw new Error(
            `Node ${node.clientId} must provide either tutorialId or tutorial.id`,
          );
        }

        if (node.id && incomingExistingIds.has(node.id)) {
          // UPDATE existing node
          await this.roadmapNodeRepo.update(
            { id: node.id },
            {
              clientId: node.clientId,
              tutorialId,
              positionX: node.positionX,
              positionY: node.positionY,
            },
          );
          clientIdToRealId.set(node.clientId, node.id);
        } else {
          // INSERT new node
          const saved = await this.roadmapNodeRepo.save(
            this.roadmapNodeRepo.create({
              clientId: node.clientId,
              roadmapId: id,
              tutorialId,
              positionX: node.positionX,
              positionY: node.positionY,
            }),
          );
          clientIdToRealId.set(node.clientId, saved.id);
        }
      }
    } else {
      // No node update — still build map for edge resolution
      const existingNodes = await this.roadmapNodeRepo.find({
        where: { roadmapId: id },
      });
      existingNodes.forEach((n) => {
        if (n.clientId) clientIdToRealId.set(n.clientId, n.id);
      });
    }

    // 3️⃣ Sync edges — wipe and reinsert
    if (edges !== undefined) {
      await this.roadmapEdgeRepo.delete({ roadmapId: id });

      for (const edge of edges) {
        const sourceNodeId = clientIdToRealId.get(edge.sourceClientId);
        const targetNodeId = clientIdToRealId.get(edge.targetClientId);

        if (!sourceNodeId || !targetNodeId) {
          throw new NotFoundException(
            `Node clientId not found: ${edge.sourceClientId} or ${edge.targetClientId}`,
          );
        }

        await this.roadmapEdgeRepo.save(
          this.roadmapEdgeRepo.create({
            roadmapId: id,
            sourceNodeId,
            targetNodeId,
          }),
        );
      }
    }

    // 4️⃣ Return refreshed roadmap
    return this.getRoadmapWithDetails(id);
  }
}
