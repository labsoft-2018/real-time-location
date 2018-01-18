import { createClient, RedisClient } from 'redis'

export const get = (redisClient: RedisClient, key: string) => new Promise((resolve, reject) => {
  redisClient.get(key, (err, data) => {
    if (err) {
      reject(err)
      return
    }
    resolve(data)
  })
})

export const set = (redisClient: RedisClient, key: string, value: string) => new Promise((resolve, reject) => {
  redisClient.set(key, value, (err, data) => {
    if (err) {
      reject(err)
      return
    }
    resolve(data)
  })
})

export const hmset = (redisClient: RedisClient, key: string, ...args) => new Promise((resolve, reject) => {
  redisClient.hmset(key, ...args, (err, data) => {
    if (err) {
      reject(err)
      return
    }
    resolve(data)
  })
})

export default (host, port) => createClient({
  host,
  port,
})
