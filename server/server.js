import { ApolloServer } from '@apollo/server';
import { expressMiddleware } from '@apollo/server/express4';
import cors from 'cors';
import express from 'express';
import { readFile } from 'node:fs/promises';
import { authMiddleware, handleLogin } from './auth.js';
import { createCompanyLoader } from './db/companies.js';
import { getUser } from './db/users.js';
import { resolvers } from './resolvers.js';
const PORT = 9000;
const app = express();
app.use(cors(), express.json(), authMiddleware);

const typeDefs = await readFile('./schema.graphql', 'utf-8')
const apolloServer = new ApolloServer({typeDefs, resolvers})

await apolloServer.start()


const getContext = async ({req: {auth}}) => {
  const companyLoader = createCompanyLoader();
   const context = {companyLoader}
    if(auth) {
      const user = await getUser(auth.sub)
      context.user = user
    }
    return context
}
app.use('/graphql', expressMiddleware(apolloServer, {
  context: getContext
}))
app.post('/login', handleLogin);



app.listen({ port: PORT }, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`GraphQL Server running on port http://localhost:${PORT}/graphql`);
});
