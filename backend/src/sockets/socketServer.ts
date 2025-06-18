import { Server } from 'socket.io'
import { ThingService } from '../services/thing.service'

export function setupSocketServer(io: Server) {
  io.on('connection', (socket) => {
    console.log('🔌 A user connected:', socket.id)

    socket.on('disconnect', () => {
      console.log('❌ User disconnected:', socket.id)
    })
  })

  setInterval(async () => {
    try {
      const allThingsTelemetry = await ThingService.getAllThings()
      io.emit('thingUpdated', allThingsTelemetry)
      console.log('📡 Emitted thingUpdated:', new Date())
    } catch (error) {
      console.error('Error fetching telemetry:', error)
    }
  }, 1000)
}
