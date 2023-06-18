import { ApolloClient, ApolloLink, concat, createHttpLink, gql, InMemoryCache } from '@apollo/client';
import { getAccessToken } from '../lib/auth';
const GRAPHQL_URL = `http://localhost:9000/graphql`

const httpLink =  createHttpLink({uri: GRAPHQL_URL})
const authLink = new ApolloLink((operation, forward) => {
    if(getAccessToken()) {
        operation.setContext({
            headers: { "Authorization": `Bearer ${getAccessToken()}`}
        })
    }
    console.log(operation.getContext())
   return forward(operation)
})

export const apolloClient = new ApolloClient({
    link: concat(authLink, httpLink),
    cache: new InMemoryCache(),
    // defaultOptions: {
    //     query: {
    //         fetchPolicy: 'network-only'
    //     },
    //     watchQuery: {
    //         fetchPolicy: 'network-only'
    //     }
    // }
})

export const jobsQuery = gql`
query { 
    jobs {
        id
        title
        description
        date
        company {
            id
            name
        }
    }
}
`
// export const getJobs  = async () => {
  
//     const {data} = await apolloClient.query({query})
//     return data.jobs
// }
const JobDetailsFragement = gql`fragment JobDetails on Job {
    id
      date
      title
      company {
        id
        name
      }
      description
}`
export const jobByIdQuery = gql`
  query JobById($id: ID!) {
    job(id: $id) {
      ...JobDetails
    }
  }
  ${JobDetailsFragement}

`;

export const getJobById = async (id) => {

    // const variables = {
    //     id
    // }
    // const {job} = await client.request(query, variables)
    const {data} = await apolloClient.query({query: jobByIdQuery, variables: {
        id
    }})
    // debugger
    return data.job
    // return data
}

export const companyByIdQuery = gql`
query Company($id: ID!) {
    company(id: $id) {
        name
        description
        jobs {
        date
        title
        description
        id
        company{
            name
            id
        }

        }
    }
}
`
// export const getCompanyById = async (id) => {
   
//     const variables = {id}
//     const {data} = await apolloClient.query({query: companyByIdQuery, variables})
//     return data.company
// }
export const createJobMutation = gql`
mutation CreateJob($input: CreateJobType!){
job: createJob(input: $input) {
    ...JobDetails
    }
}
${JobDetailsFragement}

`
export const createJob = async({title, description}) => {
   
    const variables = {input: {title, description}}
    // const {job} = await client.request(mutation, variables)
    const {data} = await apolloClient.mutate({mutation: createJobMutation, variables, update: (cache, {data}) => {
        cache.writeQuery({
            query: jobByIdQuery,
            variables: { id: data.job.id},
            data
        })
    }})
    return data.job
}