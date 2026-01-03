import { post } from '@/utils/request'
import type { PromiseResult } from '@/utils/request'

//获取角色列表
export const rolePage = (data: any): Promise<PromiseResult> => {
  return new Promise((resolve, reject) => {
    post('/role/getList', data)
      .then(res => resolve(res))
      .catch(err => reject(err))
  })
}
