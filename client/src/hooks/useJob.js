import { useQuery } from "@apollo/client"
import { jobByIdQuery } from "../graphql/queries"

export const useJob = (id) => {
    const {data, loading, error} = useQuery(jobByIdQuery, {
        variables: {
            id
        }
    })
    return {job: data?.job, loading, error}
}