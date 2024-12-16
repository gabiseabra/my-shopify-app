import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { Context } from './utils/types';
import { ruruHTML } from 'ruru/server';
import Query from './graphql/Query';
import Mutation from './graphql/Mutation';
import schema from './graphql/schema';

const app = express()

// GraphQL Playground
app.get("/", (_req, res) => {
  res.type("html")
  res.end(ruruHTML({ endpoint: "/graphql" }))
})
 
// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema,
    rootValue: {
      ...Query,
      ...Mutation,
    },
    context: (): Context => ({})
  })
)

const BE_PORT = process.env.BE_PORT || 3000
 
// Start the server at port
const server = app.listen(BE_PORT)

const shutdown = () => {
  server.close(() => {
    console.log('HTTP server closed')
  })
}

process.on('exit', shutdown);
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log(`Running a GraphQL API server at http://localhost:${BE_PORT}/graphql`)
