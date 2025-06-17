import express from 'express'
import logger from 'morgan'

import { Server } from 'socket.io'
import { createServer } from 'node:http'
import routes from './routes/routes'
import { errorHandler } from './middlewares/errorHandler'
import cors from 'cors'
import { ThingService } from './services/thing.service'

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

io.on('connection', (socket) => {
  console.log('A user connected:', socket.id)

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id)
  })
})

app.use(logger('dev'))
app.use(cors())
app.use(express.json())


app.get('/', (req, res) => {
  res.send('Hello, World!')
})
app.use('/api', routes)

app.use(errorHandler)

/* setInterval(async () => {
  try {
    const allThingsTelemetry = await ThingService.getAllThings()
    io.emit('thingUpdated', allThingsTelemetry)
    console.log('📡 Emitted thingsTelemetryUpdated:', new Date())
  } catch (error) {
    console.error('Error fetching telemetry:', error)
  }
}, 1000) */

httpServer.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`)
})