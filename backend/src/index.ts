import express from 'express'
import logger from 'morgan'

import { Server } from 'socket.io'
import { createServer } from 'node:http'
import routes from './routes/routes'
import { errorHandler } from './middlewares/errorHandler'
import cors from 'cors'
import { setupSocketServer } from './sockets/socketServer'

const port = process.env.PORT || 4000

const app = express()
const httpServer = createServer(app)
const io = new Server(httpServer,
  {
    cors: {
      origin: '*',
      methods: ['GET', 'POST'],
      allowedHeaders: ['Content-Type'],
      credentials: true,
    },
  }
)

setupSocketServer(io)

app.use(logger('dev'))
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello, World!')
})
app.use('/api', routes)

app.use(errorHandler)

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})