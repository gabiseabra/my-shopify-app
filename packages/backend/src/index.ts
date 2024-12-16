import express from 'express';
import { createHandler } from 'graphql-http/lib/use/express';
import { buildSchema } from 'graphql';
 
// Construct a schema, using GraphQL schema language
const schema = buildSchema(`
  type Query {
    hello: String
  }
`)
 
// The root provides a resolver function for each API endpoint
const root = {
  hello() {
    return "Hello world!"
  },
}
 
const app = express()
 
// Create and use the GraphQL handler.
app.all(
  "/graphql",
  createHandler({
    schema: schema,
    rootValue: root,
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

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log(`Running a GraphQL API server at http://localhost:${BE_PORT}/graphql`)
