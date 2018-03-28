import { IComponentMap, System } from '@labsoft/common-js/components/system'
import { ConfigComponent, ENV, IConfigComponent } from './components/config'
import { S3Component, IS3Component } from '@labsoft/common-js/components/s3'
import { TokenComponent, ITokenComponent } from '@labsoft/common-js/components/token'
import { HttpClient, IHttpClient } from '@labsoft/common-js/components/http'
import * as AWS from 'aws-sdk'
import { RedisSocketIOAdapter, IRedisSocketIOAdapter } from './components/redis-socketio-adapter';
import { SocketService, ISocketService } from './components/socket';
import { socketHandlers } from './socket-handlers';

export interface IComponents {
  config: IConfigComponent
  http: IHttpClient,
  s3: IS3Component,
  token: ITokenComponent,
  redisAdapter: IRedisSocketIOAdapter,
  socket: ISocketService
}
const componentMap: IComponentMap = {
  config: {
    instance: new ConfigComponent(ENV.dev),
    dependenciesList: [],
  },
  http: {
    instance: new HttpClient(),
    dependenciesList: ['config'],
  },
  s3: {
    instance: new S3Component(new AWS.S3()),
    dependenciesList: [],
  },
  token: {
    instance: new TokenComponent(),
    dependenciesList: ['config', 's3'],
  },
  redisAdapter: {
    instance: new RedisSocketIOAdapter(),
    dependenciesList: ['config'],
  },
  socket: {
    instance: new SocketService(socketHandlers),
    dependenciesList: ['config', 'redisAdapter', 'token'],
  },
}

export const mainSystem = new System<IComponents>(componentMap)
