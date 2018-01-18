import socketServer from './components/socket'
import { REDIS_HOST, REDIS_PORT, PORT } from './components/config'
import redisSocketioAdapter from './components/redis-socketio-adapter';

const main = () => {
  const redisAdapter = redisSocketioAdapter(REDIS_HOST, REDIS_PORT)
  const io = socketServer(PORT, redisAdapter)

  io.on('connection', (socket) => {
    console.log('a user connected ' + socket.id);

    socket.on('join', (data) => {
      console.log('joining room ' + data)
      socket.join(data, (err) => {
        if (err) {
          console.log('error')
          return
        }
        socket.emit('joined')
      })
    })

    socket.on('pos', (data) => {
      console.log('updating pos ' + data.lat + ', ' + data.lng + ' in ' + data.room)
      socket.broadcast.to(data.room).emit('pos', data)
    })
  });
}

main()
