import { request, gql } from 'graphql-request'

const publicApi = process.env.NEXT_PUBLIC_GRAPHQL || ''


export interface CreateProgressInput {
  userId: string;
  unitId: string;
  isCompleted: boolean;
}

export interface CreateQuizProgressInput {
  userId: string;
  quizId: string;
  score: number;
  isCompleted?: boolean;
}

export async function createQuizProgress(input: CreateQuizProgressInput) {
  return request(
    publicApi,
    gql`
      mutation CreateQuizProgress($input: CreateQuizProgressInput!) {
        createQuizProgress(input: $input) {
          id
          userId
          quizId
          score
          isCompleted
        }
      }
    `,
    { input }
  ).then((res: any) => res.createQuizProgress);
}

export async function getQuizProgressByUser(userId: string) {
  return request(
    publicApi,
    gql`
      query GetQuizProgressByUser($userId: ID!) {
        quizProgressByUser(userId: $userId) {
          id
          userId
          quizId
          score
          isCompleted
          updatedAt
          quiz {
            id
            title
          }
        }
      }
    `,
    { userId }
  ).then((res: any) => res.quizProgressByUser);
}

export async function getTutoialsInProgressByUser(userId: string) {
  return request(publicApi, gql`

query GetTutorialsWithProgressByUser($userId: ID!) {
  tutorialsWithProgressByUser(userId: $userId) {
    id
    userId
    tutorialId
    percentage
    currentUnitId
    isCompleted
    createdAt
    updatedAt
    tutorial {
      id
      tutorialName
      description
      level
      author {
        id
        username
      }
      units {
        id
        unitTitle
        order
      }
    }
    user {
      id
      username
      email
    }
  }
}

`,
    {
      userId
    }).then(res => res.tutorialsWithProgressByUser)
}



export async function getAllUnitProgressByTutorialAndUser(userId: string, tutorialId: string) {
  return request(publicApi, gql`
query GetUnitProgressByTutorialAndUser($userId: ID!, $tutorialId: ID!) {
    unitProgressByTutorialAndUser(userId: $userId, tutorialId: $tutorialId) {
      id
      userId
      isCompleted
      createdAt
    unit {
        id
        unitTitle
        tutorialId
      }
    user {
        id
        username
        email
      }
    }
  }
    `,
    {
      userId,
      tutorialId
    }).then(res => res.unitProgressByTutorialAndUser)
}




export async function createUnitProgress(input: {
  userId: string;
  unitId: string;
  isCompleted: boolean;
}) {
  return request(
    publicApi,
    gql`
      mutation CreateUnitProgress($input: CreateUnitProgressInput!) {
    createUnitProgress(createUnitProgressInput: $input) {
      userId
      id
      unitId
      isCompleted
      createdAt
    }
  }
    `,
    {
      input,
    }
  ).then((res) => res.createUnitProgress);
}


