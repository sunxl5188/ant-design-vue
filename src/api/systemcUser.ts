import { post } from '@/utils/request'
import type { PromiseResult } from '@/utils/request'

// 用户分页查询
export const userPage = (data: any): Promise<PromiseResult> => {
  return new Promise((resolve, reject) => {
    post('/system-user/getPage', data)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}
