import { System } from '@labsoft/common-js/components/system';
import { mainSystem } from './system';

const main = async () => {
  const components = await mainSystem.start()
  console.log('System started')
}

main()
.catch((err) => {
  console.log(err)
})

  // const token = await components.token.encode({
  //   user: '1',
  //   scopes: ['carrier'],
  // })
  // console.log(token)
  // const redisAdapter = redisSocketioAdapter(REDIS_HOST, REDIS_PORT)
  // const io = socketServer(PORT, redisAdapter)

  // io.on('connection', (socket) => {
  //   console.log('a user connected ' + socket.id);

  //   socket.on('join', (data) => {
  //     console.log('joining room ' + data)
  //     socket.join(data, (err) => {
  //       if (err) {
  //         console.log('error')
  //         return
  //       }
  //       socket.emit('joined')
  //     })
  //   })

  //   socket.on('pos', (data) => {
  //     console.log('updating pos ' + data.lat + ', ' + data.lng + ' in ' + data.room)
  //     socket.broadcast.to(data.room).emit('pos', data)
  //   })

  //   socket.on('disconnect', (reason) => {
  //     console.log('disconnect reason ' + reason)
  //   })
  // });
