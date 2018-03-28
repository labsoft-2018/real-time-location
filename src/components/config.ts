import { ILifecycle } from '@labsoft/common-js/components/lifecycle';
export enum ENV {
  dev,
  prod,
  test,
}

export interface IServices {
  auth: string
}

export interface IConfig {
  services: IServices
  service: {
    port: number,
    name: string,
    password: string,
  },
  token: {
    issuer: string,
    audience: string,
    jwtDuration: string,
    bucketName: string,
    publicKeyPath: string,
    privateKeyPath: string,
  },
  redis: {
    host: string,
    port: number,
  }
}

export interface IConfigComponent {
  getConfig(): IConfig
}
export class ConfigComponent implements IConfigComponent, ILifecycle {
  private config: IConfig
  private env: ENV

  constructor(env: ENV) {
    this.env = env
  }

  public getConfig() {
    return this.config
  }

  public start() {
    const {
      REDIS_HOST,
      REDIS_PORT,
      NODE_ENV,
    } = process.env

    if (!REDIS_HOST || !REDIS_PORT) {
      throw new Error('Provide REDIS configuration')
    }
    const env = NODE_ENV || 'dev'

    // TODO: Read from file!
    // TODO: Different configs for different envs
    console.log('[Config] Starting...')
    this.config = {
      services: {
        auth: 'https://auth.labsoft',  // FIXME
      },
      service: {
        port: 3000,
        name: 'real-time-location',
        password: "-e]{.*oS:U~Zz+~qz6VnU's+[1Vf12",
      },
      token: {
        issuer: 'quack-pack',
        audience: 'user',
        jwtDuration: '30d',
        publicKeyPath: `${env}/pubkey.pem`,
        privateKeyPath: `${env}/privkey.pem`,
        bucketName: 'labsoft-secrets',
      },
      redis: {
        host: REDIS_HOST,
        port: parseInt(REDIS_PORT, 10),
      },
    }
    console.log('[Config] Ok!')
  }
}
