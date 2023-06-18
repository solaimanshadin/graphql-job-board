import { useMutation } from "@apollo/client"
import { createJobMutation, jobByIdQuery } from "../graphql/queries"

export const useCreateJob = () => {
    const [mutate, {loading}] = useMutation(createJobMutation)
    const createJob = async (title, description) => {
       const {data} = await mutate({
            variables: {
                input: {title, description}
            },
            update: (cache, {data}) => {
                cache.writeQuery({
                    query: jobByIdQuery,
                    variables: {
                        id: data?.job?.id
                    },
                    data
                })
            }
        })

        return data?.job
    }

    return {createJob, loading}
}