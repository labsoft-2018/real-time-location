import { IComponents } from './system';
import { ISocketHandlerMap } from './components/socket';
import * as R from 'ramda'

const canUserFollowCarrier = (userId: string, carrierId: string) => {
  if (userId === '2' && carrierId === '1') {
    return true
  }
  return false
}

const hasScopes = (requiredScopes, scopes) => R.not(R.isEmpty(R.intersection(requiredScopes, scopes)))

const socketJoin = (socket: SocketIO.Socket, roomName: string) => new Promise((resolve, reject) => {
  socket.join(roomName, (err) => {
    if (err) {
      reject(err)
      return
    }
    resolve()
  })
})

export const socketHandlers: ISocketHandlerMap<IComponents> = {
  pos: {
    handler: async (socket, data, components: IComponents, io: SocketIO.Server) => {
      const isCarrier = hasScopes(['carrier'], socket.user.scopes)
      if (!isCarrier) {
        throw new Error('Only carrier can emit position')
      }
      // user.user is the carrierId
      const carrierId = socket.user.user
      // If this socket is not on the room carrierId, join
      if (!socket.rooms[socket.user.user]) {
        console.log(`Carrier ${carrierId} is joining his room`)
        await socketJoin(socket, carrierId)
      }

      // send the position to everyone in the "carrierId" room
      console.log(`Carrier ${carrierId} is broadcasting his position to his room`)
      socket.broadcast.to(carrierId).emit('pos', data)
    },
  },
  trackCarrier: {
    handler: async (socket, { carrierId }, components: IComponents) => {
      const userId = socket.user.user
      const scopes = socket.user.scopes
      const isUser = hasScopes(['user'], scopes)
      if (!isUser) {
        throw new Error('Only users can follow carriers')
      }

      const authorizedToFollow = canUserFollowCarrier(userId, carrierId)
      if (!authorizedToFollow) {
        throw new Error('You are not authorized to follow this carrier')
      }

      try {
        // Now the user will start receiving positions
        await socketJoin(socket, carrierId)
        console.log(`User ${userId} started tracking carrier ${carrierId}`)
      } catch (err) {
        throw new Error('Failed to join room')
      }
    },
  },
}
