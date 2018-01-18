import io from 'socket.io-client';
import R from 'ramda'

const TOTAL_USERS = 1
const HEARTBEAT_INTERVAL = 2500

const logForUser = R.curry((userId, message) => {
  console.log(`[user ${userId}]: ${message}`)
})

let connectedUsers = 0


const startSendingPos = (log, socket, interval, room) => {
  return 
}

const connectUser = (i) => {
  const room = `room${i}`
  const log = logForUser(i)
  const host = 'http://192.168.99.102:3000'
  console.log(`Connecting user ${i} in ${host}`)
  const socket = io(host, {transports: ['websocket']});
  let intervalId

  socket.on('connect', () => {
    connectedUsers++
    log(`Connected! [${connectedUsers}/${TOTAL_USERS}]`)
    socket.emit('join', room)
  })

  socket.on('joined', data => {
    log('joined room')
    if (intervalId) {
      clearInterval(intervalId)
    }
    intervalId = setInterval(() => {
      log('sending pos...')
      socket.emit('pos', {
        lat: 123.123123123,
        lng: 10.123123123,
        room: room
      })
    }, HEARTBEAT_INTERVAL)
  })
  
  socket.on('disconnect', () => {
    connectedUsers--
    log('Disconnected!')
  })
  
  socket.on('event', (data) => {
    log('event!')
    log(data)
  })
}


R.range(0, TOTAL_USERS).map(connectUser)


