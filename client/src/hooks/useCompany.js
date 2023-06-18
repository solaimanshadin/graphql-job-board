import { useQuery } from "@apollo/client"
import { companyByIdQuery } from "../graphql/queries"

export const useCompany = (id) => {
    const {data, error,loading } = useQuery(companyByIdQuery, {
      variables: {
        id
      }
    })
    return { company: data?.company, error: Boolean(error) ,loading }
}
  