import io from 'socket.io-client';
import R from 'ramda'

const TOTAL_USERS = 1

const logForUser = R.curry((userId, message) => {
  console.log(`[user ${userId}]: ${message}`)
})

let connectedUsers = 0

const connectUser = (i) => {
  const roomName = `room${i}`
  const log = logForUser(i)
  const host = 'http://192.168.99.101:3000'
  console.log(`Connecting user ${i} in ${host}`)

  const socket = io(host, {transports: ['websocket']});

  socket.on('connect', () => {
    connectedUsers++
    log(`Connected! [${connectedUsers}/${TOTAL_USERS}`)
    
    log(`joining room ${roomName}`)
    socket.emit('join', roomName)
  })

  socket.on('joined', data => {
    log(`succesfully joined room ${roomName}`)
  })
  
  socket.on('disconnect', () => {
    connectedUsers--
    log('Disconnected!')
  })
  
  socket.on('pos', (data) => {
    log('receiving pos ' + data.lat + ', ' + data.lng)
  })
}


R.range(0, TOTAL_USERS).map(connectUser)


