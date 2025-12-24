import { post } from '@/utils/request'
import type { PromiseResult } from '@/utils/request'

// 用户登录~账号密码登录
export const loginAccount = (data: {
  userName: string
  password: string
}): Promise<PromiseResult> => {
  return new Promise((resolve, reject) => {
    post('/user/login', data)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}
