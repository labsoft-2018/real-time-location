import * as socketio from 'socket.io'

export default (port, redisAdapter) => {
  console.log(`Listening on port ${port}`)
  const io = socketio(port)
  io.adapter(redisAdapter)
  return io
}
