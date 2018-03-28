import { IComponents } from './system';
import { ISocketHandlerMap } from './components/socket';

export const socketHandlers: ISocketHandlerMap<IComponents> = {
  join: {
    handler: (socket, data, components: IComponents) => {
      console.log(socket.id)
      console.log(socket.user)
    },
  },
}
