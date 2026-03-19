import { request, gql } from 'graphql-request'

const publicApi = process.env.NEXT_PUBLIC_GRAPHQL || ''

export function getSystemStats() {
  return request(
    publicApi,
    gql`
      query GetSystemStats {
        getSystemStats {
          tutorials {
            total
            published
            draft
          }
          roadmapsCount
          quizzesCount
        }
      }
    `
  ).then((res: any) => res.getSystemStats)
}
