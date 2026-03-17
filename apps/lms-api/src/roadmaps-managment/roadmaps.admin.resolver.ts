import { Resolver, Query, Mutation, Args, ID } from '@nestjs/graphql';
import { RoadmapsService } from './roadmaps.service';
import { RoadmapType } from './entities/roadmap.graphqlTyes';
import {
  CreateRoadmapInput,
  RoadmapNodeInput,
  RoadmapEdgeInput,
} from './dto/create-roadmap.input';
import { NotFoundException } from '@nestjs/common';
import { UpdateRoadmapInput } from './dto/update-roadmap.input';

@Resolver(() => RoadmapType)
export class RoadmapsAdminResolver {
  constructor(private readonly roadmapService: RoadmapsService) {}

  @Mutation(() => RoadmapType)
  async createRoadmap(
    @Args('input') input: CreateRoadmapInput,
  ): Promise<RoadmapType> {
    const { title, description, authorId, nodes, edges } = input;

    // 1️⃣ Create the roadmap first
    const roadmap = await this.roadmapService.createRoadmap({
      title,
      description,
      authorId,
    });

    // 2️⃣ Add nodes & build clientId -> real uuid map
    const nodeClientIdMap = new Map<string, string>();

    if (nodes && nodes.length > 0) {
      for (const node of nodes) {
        const savedNode = await this.roadmapService.addNode(
          roadmap.id,
          node.tutorialId,
          node.positionX,
          node.positionY,
          node.clientId,
        );
        nodeClientIdMap.set(node.clientId, savedNode.id); // "node-1" -> real uuid
      }
    }

    // 3️⃣ Add edges using REAL uuids, not clientIds
    if (edges && edges.length > 0) {
      for (const edge of edges) {
        const sourceNodeId = nodeClientIdMap.get(edge.sourceNodeId);
        const targetNodeId = nodeClientIdMap.get(edge.targetNodeId);

        if (!sourceNodeId || !targetNodeId) {
          throw new NotFoundException(
            `Node clientId not found: ${edge.sourceNodeId} or ${edge.targetNodeId}`,
          );
        }

        await this.roadmapService.addEdge(
          roadmap.id,
          sourceNodeId,
          targetNodeId,
        );
      }
    }

    // 4️⃣ Return full roadmap with details
    const fullRoadmap = await this.roadmapService.getRoadmapWithDetails(
      roadmap.id,
    );
    if (!fullRoadmap) throw new NotFoundException('Roadmap not found');
    return fullRoadmap;
  }

  /** Existing node & edge mutations */
  @Mutation(() => RoadmapType)
  async addRoadmapNode(
    @Args('roadmapId', { type: () => ID }) roadmapId: string,
    @Args('tutorialId', { type: () => ID }) tutorialId: string,
    @Args('positionX') positionX: number,
    @Args('positionY') positionY: number,
    @Args('clientId') clientId: string,
  ): Promise<RoadmapType> {
    await this.roadmapService.addNode(
      roadmapId,
      tutorialId,
      positionX,
      positionY,
      clientId,
    );
    const roadmap = await this.roadmapService.getRoadmapWithDetails(roadmapId);
    if (!roadmap) throw new NotFoundException('Roadmap not found');
    return roadmap;
  }

  @Mutation(() => RoadmapType)
  async addRoadmapEdge(
    @Args('roadmapId', { type: () => ID }) roadmapId: string,
    @Args('sourceNodeId', { type: () => ID }) sourceNodeId: string,
    @Args('targetNodeId', { type: () => ID }) targetNodeId: string,
  ): Promise<RoadmapType> {
    await this.roadmapService.addEdge(roadmapId, sourceNodeId, targetNodeId);
    const roadmap = await this.roadmapService.getRoadmapWithDetails(roadmapId);
    if (!roadmap) throw new NotFoundException('Roadmap not found');
    return roadmap;
  }

  /** Optional: fetch roadmap with nodes & edges */
  @Query(() => RoadmapType)
  async roadmap(
    @Args('id', { type: () => ID }) id: string,
  ): Promise<RoadmapType> {
    const roadmap = await this.roadmapService.getRoadmapWithDetails(id);
    if (!roadmap) throw new NotFoundException('Roadmap not found');
    return roadmap;
  }

  /** List all roadmaps */
  @Query(() => [RoadmapType])
  async roadmaps(): Promise<RoadmapType[]> {
    return this.roadmapService.getRoadmaps();
  }

  @Mutation(() => RoadmapType)
  async updateRoadmap(
    @Args('input') input: UpdateRoadmapInput,
  ): Promise<RoadmapType> {
    const updated = await this.roadmapService.updateRoadmap(input);
    if (!updated) throw new NotFoundException(`Roadmap ${input.id} not found`);
    return updated;
  }
}
