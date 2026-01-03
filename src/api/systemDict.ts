import { post, del, patch } from '@/utils/request'
import type { PromiseResult } from '@/utils/request'

//获取字典列表
export function getDictTypeList(params: any): Promise<PromiseResult> {
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

//编辑字典类型
export function editDictType(data: any): Promise<PromiseResult> {
  return new Promise((resolve, reject) => {
    patch('/dict/editDictType', data)
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

//获取字典数据列表
export function getDictList(params: any): Promise<PromiseResult> {
  return new Promise((resolve, reject) => {
    post('/dict/getDictList', params)
      .then(res => {
        resolve(res)
      })
      .catch((error: any) => {
        reject(error)
      })
  })
}

//获取字典数据
export function getDictData(type: string): Promise<PromiseResult> {
  return new Promise((resolve, reject) => {
    post('/dict/getDictData', { type })
      .then(res => {
        resolve(res)
      })
      .catch((error: any) => {
        reject(error)
      })
  })
}

//新增字典数据
export function addDictData(data: any): Promise<PromiseResult> {
  return new Promise((resolve, reject) => {
    post('/dict/addDictData', data)
      .then(res => {
        resolve(res)
      })
      .catch((error: any) => {
        reject(error)
      })
  })
}

//编辑字典数据
export function editDictData(data: any): Promise<PromiseResult> {
  return new Promise((resolve, reject) => {
    patch('/dict/editDictData', data)
      .then(res => {
        resolve(res)
      })
      .catch((error: any) => {
        reject(error)
      })
  })
}
// 删除字典数据
export function delDictData(ids: string): Promise<PromiseResult> {
  return new Promise((resolve, reject) => {
    del('/dict/deleteDictData', { ids })
      .then(res => {
        resolve(res)
      })
      .catch((error: any) => {
        reject(error)
      })
  })
}
