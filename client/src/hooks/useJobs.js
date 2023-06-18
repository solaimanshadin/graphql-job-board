import { useQuery } from "@apollo/client"
import { jobsQuery } from "../graphql/queries"

export const useJobs = () => {
    const {data, loading, error} = useQuery(jobsQuery,     {fetchPolicy: 'network-only'}
    )

    return {jobs: data?.jobs, loading, error: Boolean(error)}
}