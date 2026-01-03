//https://www.axios-http.cn/docs/intro
//http://www.axios-js.com/zh-cn/docs/#axios-put-url-data-config
import axios from 'axios'
import type {
  AxiosRequestConfig,
  AxiosResponse,
  AxiosError,
  InternalAxiosRequestConfig
} from 'axios'
import { useUserStore } from '@/store'
import { useModal } from './useModal'

declare module 'axios' {
  //这里扩展里AxiosError类型
  interface InternalAxiosRequestConfig {
    _count?: number
  }
}

export type PromiseResult<T = any> = {
  code: number
  msg: string
  data: T
  [key: string]: any
}

const { message } = useModal()

let has401Notified = false
const handleMessage = (
  content: string,
  type: '401' | 'default' = 'default'
): void => {
  if (type === '401') {
    if (has401Notified) return
    has401Notified = true
    setTimeout(() => {
      has401Notified = false
    }, 3000) // 3秒内只提示一次
  }
  message.error(content)
}

/**
 * 请求失败错误码统一处理
 * @param status
 * @param other
 */

const errorHandle = (status: number, other: string) => {
  // 状态码判断
  switch (status) {
    case 302: {
      handleMessage(`${status}:接口重定向了！`)
      break
    }
    case 400: {
      handleMessage(
        `${status}:发出的请求有错误，服务器没有进行新建或修改数据的操作`
      )
      break
    }
    // 401: 未登录
    // 未登录则跳转登录页面，并携带当前页面的路径
    // 在登录成功后返回当前页面，这一步需要在登录页操作。
    //重定向
    case 401: {
      handleMessage(`${status}:登录失效`, '401')
      break
    }

    // 403 token过期
    // 清除token并跳转登录页
    case 403: {
      handleMessage(`${status}:登录过期,用户得到授权，但是访问是被禁止的`)
      break
    }
    case 404: {
      handleMessage(`${status}:网络请求不存在`)
      break
    }
    case 406: {
      handleMessage(`${status}:请求的格式不可得`)
      break
    }
    case 408: {
      handleMessage(`${status}:请求超时！`)
      break
    }
    case 410: {
      handleMessage(`${status}:请求的资源被永久删除，且不会再得到的`)
      break
    }
    case 422: {
      handleMessage(`${status}:当创建一个对象时，发生一个验证错误`)
      break
    }
    case 500: {
      handleMessage(`${status}:服务器发生错误，请检查服务器`)
      break
    }
    case 502: {
      handleMessage(`${status}:网关错误`)
      break
    }
    case 503: {
      handleMessage(`${status}:服务不可用，服务器暂时过载或维护`)
      break
    }
    case 504: {
      handleMessage(`${status}:网关超时`)
      break
    }
    default: {
      handleMessage(`${status}:其他错误`)
      console.log(other)
    }
  }
}

/**
 * 实例化配置
 */
const instance = axios.create({
  baseURL: import.meta.env.VITE_API,
  headers: {
    'Content-Type': 'application/json;charset=UTF-8' //默认
  },
  timeout: 1000 * 60,
  withCredentials: false, // 表明跨域请求是否需要证明
  responseType: 'json', // 'arraybuffer','blob','document','json','text',stream'
  responseEncoding: 'utf8'
})

/**
 * 请求拦截器, 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { token } = JSON.parse(
      localStorage.getItem('userStore' + __APP_VERSION__) || '{}'
    )
    if (token && config.headers) {
      config.headers.Authorization = token
      config.headers.Token = token
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

/**
 * 响应拦截器
 */
instance.interceptors.response.use(
  function (config: AxiosResponse) {
    // 请求成功
    if ([200, 201, 202, 204].includes(config.status)) {
      return Promise.resolve(config.data)
    }
    return Promise.reject(new Error('请求失败'))
  }, // 请求失败
  function (error: AxiosError) {
    const { response, config } = error
    if (response) {
      errorHandle(response.status, (response.data as any).message)
      if (response.status === 401) {
        const userStore = useUserStore()
        userStore.loginOut()
        setTimeout(() => {
          location.href = '/login'
        }, 1500)
      }
      // 超时重新请求
      // 全局的请求次数,请求的间隙
      const [RETRY_COUNT, RETRY_DELAY] = [1, 1000]

      if (config && RETRY_COUNT && ![404, 500].includes(response.status)) {
        config._count = config._count ?? 0
        if (config._count >= RETRY_COUNT) {
          throw new Error('请求超时，请稍后重试')
        }
        config._count++
        return new Promise(resolve => {
          setTimeout(resolve, RETRY_DELAY || 1)
        }).then(() => instance(config))
      }
    }
    // 处理断网的情况
    // eg:请求超时或断网时，更新state的network状态
    // network状态在app.vue中控制着一个全局的断网提示组件的显示隐藏
    // 后续增加断网情况下做的一些操作
  }
)

/**
 * Axios.GET
 * @param url API地址
 * @param params 参数
 * @param config axios.config
 * @returns 返回数据
 */
export const fetch = <T = any>(
  url: string,
  params: object = {},
  config?: AxiosRequestConfig
): Promise<PromiseResult<T>> => {
  return instance
    .get(url, { params: params, ...config })
    .then((response: any) => response as PromiseResult<T>)
}

/**
 * Axios.POST
 * @param url API地址
 * @param data 参数
 * @param config axios.config
 * @returns 返回数据
 */
export const post = <T = any>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<PromiseResult<T>> => {
  return instance
    .post(url, data, { ...config })
    .then((response: any) => response as PromiseResult<T>)
}

/**
 * Axios.PUT~完整的更新资源,修改数据:将所有数据都推送到后端
 * @param url API地址
 * @param data 参数
 * @param config axios.config
 * @returns 返回数据
 */
export const put = <T = any>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<PromiseResult<T>> => {
  return instance
    .put(url, data, config)
    .then((response: any) => response as PromiseResult<T>)
}

/**
 * Axios.PATCH~局部更新~修改数据：只将修改的数据推送到后端
 * @param url API地址
 * @param data 参数
 * @param config axios.config
 * @returns 返回数据
 */
export const patch = <T = any>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<PromiseResult<T>> => {
  return instance
    .patch(url, data, config)
    .then((response: any) => response as PromiseResult<T>)
}

/**
 * Axios.DELETE 用于删除数据
 * @param url API地址
 * @param data 参数
 * @param config axios.config
 * @returns 返回数据
 */
export const del = <T = any>(
  url: string,
  data: any,
  config?: AxiosRequestConfig
): Promise<PromiseResult<T>> => {
  return instance
    .delete(url, { ...config, data })
    .then((response: any) => response as PromiseResult<T>)
}

/**
 * Axios.REQUEST请求
 * @param config axios.config
 * @returns 返回数据
 */
export const request = <T = any>(
  config: AxiosRequestConfig
): Promise<PromiseResult<T>> => {
  return instance
    .request(config)
    .then((response: any) => response as PromiseResult<T>)
}
