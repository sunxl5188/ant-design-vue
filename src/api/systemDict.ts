import { post, del } from '@/utils/request'
import type { PromiseResult } from '@/utils/request'

//获取字典列表
export function getDictList(params: any): Promise<PromiseResult> {
  return new Promise((resolve, reject) => {
    post('/dict/getList', params)
      .then(res => {
        resolve(res)
      })
      .catch((error: any) => {
        reject(error)
      })
  })
}

//新增字典类型
export function addOrDictType(data: any): Promise<PromiseResult> {
  return new Promise((resolve, reject) => {
    post('/dict/addDictType', data)
      .then(res => {
        resolve(res)
      })
      .catch((error: any) => {
        reject(error)
      })
  })
}

//删除字典类型
export function delDictType(ids: string): Promise<PromiseResult> {
  return new Promise((resolve, reject) => {
    del('/dict/deleteDictType', { ids })
      .then(res => {
        resolve(res)
      })
      .catch((error: any) => {
        reject(error)
      })
  })
}
