import { createServer } from 'node:http';
import { Server } from 'socket.io'

// export const socket = new SocketService()
export const websocket_server = createServer()
export const websocket = new Server(websocket_server, {
  cors: {
    origin: '*',
    credentials: false
  },
})


websocket.on("connection", (socket) => {
  console.log('new socket', socket.id)
  // sockets.push(socket)

  socket.on('sub', room_id => {
    console.log('socket', socket.id, 'join to', room_id)
    socket.join(room_id)

  })

  socket.on('unsub', room_id => socket.leave(room_id))

  socket.on("disconnect", () => {
    console.log('socket', socket.id, 'leved')
    socket.rooms.forEach(room => socket.leave(room))
  });;
});


