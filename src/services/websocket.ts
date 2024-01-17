import { getDeviceRepository } from '@/data-source';
import { Server } from 'socket.io'

class SocketService {
  io: Server

  init(_io: Server) { this.io = _io }
}

// export const socket = new SocketService()

export const io = new Server(8080, {
  cors: {
    origin: '*',
    credentials: false
  },
})