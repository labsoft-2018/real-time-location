import { RedisClient } from 'redis'
import { getUserKey } from '../logic/user'
import { hmset } from '../components/redis'

export const setUserLocation = (redisClient: RedisClient, userId: string, lat: number, lng: number) => {
  return hmset(redisClient, getUserKey(userId), 'lat', lat, 'lng', lng)
}
