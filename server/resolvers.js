import { GraphQLError } from "graphql"
import {  getCompany } from "./db/companies.js"
import { createJob, deleteJob, getJob, getJobs, updateJob } from "./db/jobs.js"

export const resolvers = {
    Query: {
        jobs: (root, {limit, offset}) => getJobs(limit, offset),
        job: (root, {id}) => getJob(id),
        company: async (root, {id}) => {
           const company = await getCompany(id)
           if(!company) {
                return notFoundError("Company not found!")
           }
           return company
        }
    },
    Mutation: {
        createJob: (root, {input: {title, description}}, {user}) => {
            if(!user) {
                return notAuthorizedError()
            }
            const companyId = user.companyId

            return createJob({title, description, companyId}) 
        },
        deleteJob: async (root, {id}, {user}) => { 
            if(!user) {
                return notAuthorizedError()
            }
            const job =  deleteJob(id, user.companyId) 
            if(!job) {
                return notFoundError('No job found!')
            }
            return job
        },
        updateJob: (root, {input: {id, title, description}}, {user}) => {
            if(!user) {
                return notAuthorizedError()
            }
            return updateJob({id, companyId: user.companyId, title, description})
        }
    },
    Job: {
        date: (root) => toIsoDate(root.createdAt),
        company: (root, _args, {companyLoader}) => companyLoader.load(root.companyId)
    },
    Company: {
        jobs: () => getJobs()
    }


}

function toIsoDate(value) {
    return value.slice(0, 'yyyy-mm-dd'.length)
}

function notFoundError (message) {
    return new GraphQLError(message, {
        extensions: {code: 'NOT_FOUND'}
    })
}

function notAuthorizedError (message) {
    return new GraphQLError('User not authenticated!', {
        extensions: {code: 'NOT_AUTHENTICATED'}
    })
}