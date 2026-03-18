import { request, gql, GraphQLClient } from 'graphql-request'

export const publicApiClient = new GraphQLClient(
  process.env.NEXT_PUBLIC_GRAPHQL!,
  {
    credentials: 'include', // 🔥 THIS
  }
);

const publicApi = process.env.NEXT_PUBLIC_GRAPHQL || ''
const adminApi = process.env.NEXT_PUBLIC_ADMIN_GRAPHQL || ''


export async function REGISTER(userData: { email: string, password: string }) {
  return publicApiClient.request(
    gql`
mutation Users($userData: CreateUserInput!) {
  registerUser(createUserInput: $userData) {
    id
    email
    username
  }
}
    `,
    {
      userData: userData
    }
  ).then(res => {
    return res.user_signin
  }
  )
}





export async function SIGNIN(userData: { email: string, password: string }) {
  return publicApiClient.request(
    gql`
mutation Users($userData: FindUserInput!) {
  user_signin(userData: $userData) {
    access_token
  }
}
    `,
    {
      userData: userData
    }
  ).then(res => {
    return res.user_signin
  }
  )
}


export const getMe = async () => {
  return await publicApiClient.request(gql`
      query {
        me {
          sub 
          username
          email
          role
subscriptionStatus
        }   
      }`
  )
}

export const LOGOUT = async () => {
  return await publicApiClient.request(gql`
  mutation {
    logout
  }
`
  )
}










