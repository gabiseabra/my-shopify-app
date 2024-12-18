import fs from 'fs'
import express from 'express'
import cors from 'cors'
import { createHandler } from 'graphql-http/lib/use/express'
import Query from './graphql/Query'
import Mutation from './graphql/Mutation'
import { buildSchema } from 'graphql'

const app = express()

const schema = buildSchema(fs.readFileSync('src/graphql/schema.gql', 'utf8'))

const BE_PORT = process.env.BE_PORT || 3000

app.use(cors())

// Create and use the GraphQL handler.
app.all(
  '/graphql',
  createHandler({
    schema,
    rootValue: {
      ...Query,
      ...Mutation,
    },
  })
)

// Start the server at port
const server = app.listen(BE_PORT)

const shutdown = () => {
  server.close(() => {
    console.log('HTTP server closed')
  })
}

process.on('exit', shutdown)
process.on('SIGINT', shutdown)
process.on('SIGTERM', shutdown)

console.log(
  `Running a GraphQL API server at http://localhost:${BE_PORT}/graphql`
)
