export * from './queries/tutorialsQueries'
export * from './queries/progressQueries'
export * from './queries/roadmapsQueries'
export * from './queries/quizzes'
export * from './queries/auth.query'
export * from './queries/fileUpload'
export * from './queries/systemStats'


//------------- tanstack setup  -------------------
export * from './tanStack-setup/createQueryClient'
export * from './tanStack-setup/tacnstackProvider'



export {
  HydrationBoundary,
  dehydrate,
  QueryClient,
  useQuery,
  useQueryClient,
  useMutation
} from '@tanstack/react-query';


