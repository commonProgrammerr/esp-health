import { getDeviceRepository } from '@/data-source';
import { createServer } from 'node:http';
import { Server, Socket } from 'socket.io'
import EventEmitter from 'node:events';
class SocketService {
  io: Server

  init(_io: Server) { this.io = _io }
}

// export const socket = new SocketService()
export const websocket_server = createServer()
export const websocket_handle = new EventEmitter()
export const websocket = new Server(websocket_server, {
  cors: {
    origin: '*',
    credentials: false
  },
})

export function sendLog(log: string) {
  websocket.emit('line', log)
}



websocket.on("connection", (socket) => {
  console.log('new socket', socket.id)
  // sockets.push(socket)

  socket.on('sub', room_id => {
    console.log('socket', socket.id, 'join to', room_id)
    socket.join(room_id)
    websocket_handle.on(room_id, (data) => socket.emit('line', data))
  })
  socket.on('unsub', room_id => socket.leave(room_id))

  socket.on("disconnect", () => {
    console.log('socket', socket.id, 'leved')
    socket.rooms.forEach(room => socket.leave(room))
  });;
});


