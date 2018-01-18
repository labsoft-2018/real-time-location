import * as redis from 'socket.io-redis'

export default (host, port) => {
  return redis({
    host,
    port,
  })
}
