import * as redis from 'socket.io-redis'
import { ILifecycle } from '@labsoft/common-js/components/lifecycle';
import { IConfigComponent } from './config';

export interface IRedisSocketIOAdapter {
  getRedisAdapter(): any
}

export class RedisSocketIOAdapter implements ILifecycle, IRedisSocketIOAdapter {
  private redisAdapter: any

  public getRedisAdapter() {
    return this.redisAdapter
  }

  public start({ config }: { config: IConfigComponent }) {
    const {
      host,
      port,
    } = config.getConfig().redis

    this.redisAdapter = redis({
      host,
      port,
    })
  }

  public stop() {
    // noop
  }
}
