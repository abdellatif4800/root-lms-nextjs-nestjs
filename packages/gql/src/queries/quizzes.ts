import { request, gql } from 'graphql-request'

const publicApi = process.env.NEXT_PUBLIC_GRAPHQL || ''
const adminApi = process.env.NEXT_PUBLIC_ADMIN_GRAPHQL || ''

// ─── Fragments (reused across queries) ───────────────────────────────────────

const OPTION_FIELDS = gql`
  fragment OptionFields on QuestionOptionType {
    id
    text
    isCorrect
    order
  }
`

const QUESTION_FIELDS = gql`
  fragment QuestionFields on QuestionType_ {
    id
    text
    type
    points
    order
    modelAnswer
    correctBooleanAnswer
    options {
      ...OptionFields
    }
  }
  ${OPTION_FIELDS}
`

const QUIZ_FIELDS = gql`
  fragment QuizFields on QuizType {
    id
    title
    description
    passMark
    timeLimit
    shuffleQuestions
    publish
    createdAt
    updatedAt
    questions {
      ...QuestionFields
    }
  }
  ${QUESTION_FIELDS}
`

// ─── Queries ──────────────────────────────────────────────────────────────────

export function getAllQuizzes() {
  return request(
    publicApi,
    gql`
      query GetAllQuizzes {
        allQuizzes {
          ...QuizFields
        }
      }
      ${QUIZ_FIELDS}
    `
  ).then((res: any) => res.allQuizzes)
}

export function getQuizById(id: string) {
  return request(
    publicApi,
    gql`
      query GetQuizById($id: ID!) {
        quizById(id: $id) {
          ...QuizFields
        }
      }
      ${QUIZ_FIELDS}
    `,
    { id }
  ).then((res: any) => res.quizById)
}

// ─── Mutations ────────────────────────────────────────────────────────────────

export function createQuiz(inputData: any) {
  return request(
    adminApi,
    gql`
      mutation CreateQuiz($input: CreateQuizInput!) {
        createQuiz(input: $input) {
          ...QuizFields
        }
      }
      ${QUIZ_FIELDS}
    `,
    { input: inputData }
  ).then((res: any) => res.createQuiz)
}

export function updateQuiz(inputData: any) {
  return request(
    adminApi,
    gql`
      mutation UpdateQuiz($input: UpdateQuizInput!) {
        updateQuiz(input: $input) {
          ...QuizFields
        }
      }
      ${QUIZ_FIELDS}
    `,
    { input: inputData }
  ).then((res: any) => res.updateQuiz)
}

export function removeQuiz(id: string) {
  return request(
    adminApi,
    gql`
      mutation RemoveQuiz($id: ID!) {
        removeQuiz(id: $id)
      }
    `,
    { id }
  ).then((res: any) => res.removeQuiz)
}

export function toggleQuizPublish(id: string) {
  return request(
    adminApi,
    gql`
      mutation ToggleQuizPublish($id: ID!) {
        toggleQuizPublish(id: $id) {
          id
          publish
        }
      }
    `,
    { id }
  ).then((res: any) => res.toggleQuizPublish)
}
