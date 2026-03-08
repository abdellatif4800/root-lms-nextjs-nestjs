import { request, gql } from 'graphql-request'

const publicApi = process.env.NEXT_PUBLIC_GRAPHQL || ''

/** Types for inputs */
export interface CreateRoadmapInput {
  title: string
  description?: string
  authorId: string
}

export interface CreateNodeInput {
  roadmapId: string
  tutorialId: string
  positionX: number
  positionY: number
}

export interface CreateEdgeInput {
  roadmapId: string
  sourceNodeId: string
  targetNodeId: string
}

export interface CreateFullRoadmapInput {
  title: string
  description?: string
  authorId: string
  nodes?: {
    clientId: string
    tutorialId: string
    positionX: number
    positionY: number
  }[]
  edges?: {
    sourceNodeId: string
    targetNodeId: string
  }[]
}

export async function createFullRoadmap(input: CreateFullRoadmapInput) {
  const mutation = gql`
    mutation CreateRoadmap($input: CreateRoadmapInput!) {
      createRoadmap(input: $input) {
        id
        title
        description
        authorId
        nodes {
          id
          clientId
          positionX
          positionY
          tutorial {
            id
            tutorialName
          }
        }
        edges {
          id
          sourceNodeId
          targetNodeId
        }
        createdAt
        updatedAt
      }
    }
  `
  const res = await request(publicApi, mutation, { input })
  return res.createRoadmap
}

/** 1️⃣ Create a new roadmap (without nodes) */
export async function createRoadmap(input: CreateRoadmapInput) {
  const mutation = gql`
    mutation CreateRoadmap($input: CreateRoadmapInput!) {
      createRoadmap(input: $input) {
        id
        title
        description
        authorId
        createdAt
        updatedAt
      }
    }
  `

  const res = await request(publicApi, mutation, { input })
  return res.createRoadmap
}

/** 2️⃣ Add a node to an existing roadmap */
export async function addRoadmapNode(input: CreateNodeInput) {
  const mutation = gql`
    mutation AddRoadmapNode(
      $roadmapId: ID!
      $tutorialId: ID!
      $positionX: Float!
      $positionY: Float!
    ) {
      addRoadmapNode(
        roadmapId: $roadmapId
        tutorialId: $tutorialId
        positionX: $positionX
        positionY: $positionY
      ) {
        id
        title
        nodes {
          id
          positionX
          positionY
          tutorial {
            id
            tutorialName
          }
        }
      }
    }
  `

  const res = await request(publicApi, mutation, input)
  return res.addRoadmapNode
}

/** 3️⃣ Add an edge between two nodes */
export async function addRoadmapEdge(input: CreateEdgeInput) {
  const mutation = gql`
    mutation AddRoadmapEdge(
      $roadmapId: ID!
      $sourceNodeId: ID!
      $targetNodeId: ID!
    ) {
      addRoadmapEdge(
        roadmapId: $roadmapId
        sourceNodeId: $sourceNodeId
        targetNodeId: $targetNodeId
      ) {
        id
        title
        edges {
          id
          sourceNodeId
          targetNodeId
        }
      }
    }
  `

  const res = await request(publicApi, mutation, input)
  return res.addRoadmapEdge
}

/** 4️⃣ Get a roadmap by ID (with nodes & edges) */
export async function getRoadmap(roadmapId: string) {
  const query = gql`
query GetRoadmap($id: ID!) {
  roadmap(id: $id) {
    id
    title
    description
    author{
      id
      username
    } 
    nodes {
      id
      clientId
      positionX
      positionY
      tutorial {
        id
        tutorialName
        description
        category
        level
      }
    }
    edges {
      id
      sourceNodeId
      targetNodeId
      sourceClientId
      targetClientId
    }
    createdAt
    updatedAt
  }
}
  `

  const res = await request(publicApi, query, { id: roadmapId })
  return res.roadmap
}

/** 5️⃣ List all roadmaps */
export async function getRoadmaps() {
  const query = gql`
    query GetRoadmaps {
      roadmaps {
        id
        title
        description
        authorId
        nodes {
          id
          positionX
          positionY
          tutorial {
            id
            tutorialName
          }
        }
        edges {
          id
          sourceNodeId
          targetNodeId
        }
      }
    }
  `

  const res = await request(publicApi, query)
  return res.roadmaps
}
