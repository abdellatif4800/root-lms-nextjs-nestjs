// import { gql } from "@apollo/client";
import { request, gql } from 'graphql-request'

const publicApi = process.env.NEXT_PUBLIC_GRAPHQL || ''
const adminApi = process.env.NEXT_PUBLIC_ADMIN_GRAPHQL || ''


export const CREATE_TUTORIAL = gql`  
mutation CreateTutorial($tutorialData: CreateTutorialInput!) {
  createTutorial(input: $tutorialData) {
    id
    tutorialName
    description
    level
    thumbnail
category 
authorId
    units {
      content
      id
      tutorialId
      order
      unitTitle
    }
  }
}
`
export interface CreateTutorialInput {
  tutorialName: string;
  description: string;
  level: string;
  thumbnail?: string;
  // Add other fields required by your CreateTutorialInput
}

export function createTutorial(inputData: any) {
  return request(
    adminApi,
    CREATE_TUTORIAL,
    {
      tutorialData: inputData
    }
  )
}


export function updateTutorial(inputData: any) {
  return request(
    adminApi,
    gql`
mutation UpdateTutorial($input: UpdateTutorialInput!) {
  updateTutorial(updateTutorialInput: $input) {
    id
    tutorialName
    description
    level
    thumbnail
    publish
    authorId
    units {
      content
      id
      tutorialId
      order
      publish
      unitTitle
    }
  }
}
`,
    {
      input: inputData
    }
  )
}



export function getTutorials(filters: any) {
  return request(publicApi, gql`
    query Tutorial($Filters: FilterTutorialInput!){
      tutorialList(filters: $Filters) {
        id
        tutorialName
        level
        category
        publish
thumbnail
isPaid
price
        units {
          id
          order
          content
          tutorialId
        }
      }
    }
    `,
    {
      Filters: filters,
    }).then(res => res.tutorialList)
}

export function getTutorialById(ID: string) {
  return request(publicApi, gql`
    query Tutorial($ID: ID!) {
        tutorialById(id: $ID) {
          id
          tutorialName
category
description
level
publish
thumbnail
isPaid
price

          unitsTitlesList
  author{
id
username
}
          units {
            id
            order
            content
publish
unitTitle
          }
        }
    }
    `,
    {
      ID: ID,
    }).then(res => res.tutorialById)

}


export function getUnitsByTutorialId(ID: string) {
  return request(publicApi, gql`
    query Tutorial($ID: ID!) {
        tutorialById(id: $ID) {
id
tutorialName
publish
author{
username
}
units {
  id
  unitTitle
  publish
}
}
}
    `,
    {
      ID: ID,
    }).then(res => res.tutorialById)
}

export function getUnitById(ID: string) {
  return request(publicApi, gql`
query UnitById($ID: ID!) {
  unitById(id: $ID) {
    id
    unitTitle
    content
    order
    publish
    tutorialId
    createdAt
    updatedAt
  }
}
    `,
    {
      ID: ID,
    }).then(res => res.unitById)
}



