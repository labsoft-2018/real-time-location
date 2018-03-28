import * as socketio from 'socket.io'
import { ILifecycle } from '@labsoft/common-js/components/lifecycle';
import { IConfigComponent } from './config';
import { IRedisSocketIOAdapter } from './redis-socketio-adapter';
import { ITokenComponent } from '@labsoft/common-js/components/token';

const isValidToken = (token: string) => {
  return true
}

export interface IAuthenticatedSocket extends SocketIO.Socket {
  user?: IUser
}

export interface ISocketHandlerMap<T> {
  [event: string]: {
    handler(socket: IAuthenticatedSocket, data: any, components: T, io: SocketIO.Server): any,
  }
}

interface IDependencies {
  config: IConfigComponent,
  redisAdapter: IRedisSocketIOAdapter,
  token: ITokenComponent,
}

export interface ISocketService {
  getIO(): SocketIO.Server
}

export interface IUser {
  user: string,
  scopes: string[]
}

export class SocketService<T> implements ILifecycle, ISocketService {
  private io: SocketIO.Server
  private socketHandlerMap: ISocketHandlerMap<T>

  constructor(socketHandlerMap: ISocketHandlerMap<T>) {
    this.socketHandlerMap = socketHandlerMap
  }

  public getIO() {
    return this.io
  }

  public start(deps: IDependencies) {
    const { config, redisAdapter } = deps
    console.log('starting socket io server')
    const port = config.getConfig().service.port
    const io = socketio(port)

    // TODO: Extract to function passed as parameter
    io.use(async (socket: IAuthenticatedSocket, next) => {
      const tokenComponent = deps.token
      const token = socket.handshake.query.token

      try {
        const user = await tokenComponent.decode<IUser>(token)
        socket.user = user
        next()
      } catch (err) {
        console.log('Invalid token...')
        return next(new Error('authentication error'));
      }
    });
    io.adapter(redisAdapter.getRedisAdapter())

    io.on('connection', (socket) => {
      console.log('new connection: ', socket.id)

      for (const event of Object.keys(this.socketHandlerMap)) {
        const eventObject = this.socketHandlerMap[event]

        socket.on(event, async (data) => {
          try {
            await eventObject.handler(socket, data, deps as any, io)
          } catch (err) {
            console.log('emitting error:', err.toString())
            socket.emit(`${event}-error`, err.toString())
          }
        })
      }
    })
    this.io = io
  }

  public stop() {
    this.io.close()
  }
}
