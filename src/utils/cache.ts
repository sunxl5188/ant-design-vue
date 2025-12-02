import dayjs from '@/utils/dayjs'
import { encryptData, decryptData } from './cryptojs'

type TimeType = string | number | Date | undefined
// type DataType = Record<string, any>

const env = import.meta.env
const CACHE_NAME = 'app' + __APP_VERSION__
const IS_ENCRYPT = env.MODE === 'development' // 是否加密存储

/**
 * 设置缓存时间,返回时间戳
 * @param {*} time
 */
const getExpireTimes = (time: TimeType) => {
  let _expires = 0 // 默认不过期
  if (time) {
    const reg = /^(\d+)(?:[ymdh])$/i
    const expireTime = time.toString().replace(reg, '$1')
    switch (time.constructor) {
      case Number:
        _expires = dayjs().add(Number(time), 'second').valueOf()
        break
      case String:
        if (/^(?:\d+([ymdh]))$/i.test(time.toString())) {
          // get capture type group , to lower case
          const type = time
            .toString()
            .replace(/^(?:\d+)([ymdh])$/i, '$1')
            .toLowerCase()
          switch (type) {
            // Frequency sorting
            case 'm': //月
              _expires = dayjs().add(Number(expireTime), 'month').valueOf()
              break
            case 'd': //天
              _expires = dayjs().add(Number(expireTime), 'day').valueOf()
              break
            case 'h': //小时
              _expires = dayjs().add(Number(expireTime), 'hour').valueOf()
              break
            case 'y': //年
              _expires = dayjs().add(Number(expireTime), 'year').valueOf()
              break
            default:
              console.error('设置未知异常')
          }
        } else {
          _expires = dayjs().add(Number(expireTime), 'second').valueOf()
        }
        break
      case Date:
        _expires = dayjs((time as Date).toUTCString()).valueOf()
        break
      default:
        _expires = dayjs().add(1, 'day').valueOf() // 默认一天时间
    }
  }
  return _expires
}

/**
 * localStorage缓存
 */
export const local = {
  /**
   * 设置localStorage缓存
   * @param key localStorage名
   * @param value localStorage 值
   * @param expire 过期时间
   * @returns
   */
  set(key: string, value: any, expire?: TimeType): void {
    if (!localStorage) return
    if (key && value) {
      const data = JSON.parse(localStorage.getItem(CACHE_NAME) || '{}')
      const params = {
        value: IS_ENCRYPT ? encryptData(value) : JSON.stringify(value),
        expire: getExpireTimes(expire)
      }
      data[key] = params
      localStorage.setItem(CACHE_NAME, JSON.stringify(data))
    }
  },
  /**
   * 获取localStorage值
   * @param key localStorage名
   * @returns localStorage 值
   */
  get(key: string): string {
    let value: string = ''
    if (key && localStorage) {
      const data = JSON.parse(localStorage.getItem(CACHE_NAME) || '{}')
      if (Object.keys(data).length && data[key]) {
        if (data[key].expire === 0 || data[key].expire > Date.now()) {
          value = IS_ENCRYPT ? decryptData(data[key].value) : data[key].value
        } else if (data.expire < Date.now()) {
          this.remove(key)
        }
      }
    }
    return value
  },
  /**
   * 删除localStorage
   * @param key localStorage名
   */
  remove(key: string) {
    const data = JSON.parse(localStorage.getItem(CACHE_NAME) || '{}')
    if (data) {
      delete data[key]
      localStorage.setItem(CACHE_NAME, JSON.stringify(data))
    }
  }
}

/**
 * sessionStorage缓存
 */
export const session = {
  /**
   * 设置sessionStorage
   * @param key sessionStorage名
   * @param value sessionStorage值
   * @returns void
   */
  set(key: string, value: any) {
    if (!sessionStorage) return
    if (key && value) {
      const data = JSON.parse(sessionStorage.getItem(CACHE_NAME) || '{}')
      data[key] = IS_ENCRYPT ? encryptData(value) : JSON.stringify(value)
      sessionStorage.setItem(CACHE_NAME, JSON.stringify(data))
    }
  },
  /**
   * 获取 sessionStorage
   * @param key sessionStorage名
   * @returns 返回sessionStorage值得
   */
  get(key: string): string {
    let value: string = ''
    if (key && sessionStorage) {
      const data = JSON.parse(sessionStorage.getItem(CACHE_NAME) || '{}')
      if (Object.keys(data)?.length && data[key]) {
        value = IS_ENCRYPT ? decryptData(data[key]) : data[key]
      }
    }
    return value
  },
  /**
   * 删除sessionStorage
   * @param key sessionStorage名
   */
  remove(key: string) {
    const data = JSON.parse(sessionStorage.getItem(CACHE_NAME) || '{}')
    if (data) {
      delete data[key]
      sessionStorage.setItem(CACHE_NAME, JSON.stringify(data))
    }
  }
}
