import ClipboardJS from 'clipboard'
import { useAppStore } from '@/store'

/**
 * @复制文本
 * @param el 触发复制的元素class或id
 * @官方地址 https://clipboardjs.uihtm.com/
 */
export function copyContent(el: string) {
  const clipboard = new ClipboardJS(el)
  clipboard.on('success', function (e) {
    console.info('Action:', e.action)
    console.info('Text:', e.text)
    console.info('Trigger:', e.trigger)
    e.clearSelection()
  })

  clipboard.on('error', function (e) {
    console.error('Action:', e.action)
    console.error('Trigger:', e.trigger)
  })
}

/**
 * 引用assets下的图片
 * @param fileName 图片名
 * @returns 返回图片地址
 */
export const getAssetsFile = (fileName: string) => {
  return new URL(`../assets/images/${fileName}`, import.meta.url).href
}

/**
 * @查找字典名称
 * @param type 字典类型
 * @param value 字典对应的值
 * @returns 返回名称
 */
export function getDictFilter(type: string, value: string | Array<string>) {
  let result = '--'
  if (!type || !value) return result

  const handleString = (dictData: Array<{ label: string; value: any }>) => {
    let dictItem = null
    if (Array.isArray(value)) {
      dictItem = dictData
        .filter((item: any) => value.includes(item.value))
        ?.map((i: any) => i.label)
      if (dictItem.length) {
        result = dictItem.join('、')
      }
    } else {
      dictItem = dictData.find((item: any) => item.value === value)
      if (dictItem) {
        result = dictItem.label
      }
    }
    return result || '--'
  }

  const appStore = useAppStore()
  const dictData = appStore.getDictOptions(type)
  if (dictData?.length) {
    return handleString(dictData)
  }
  appStore
    .fetchDictData(type)
    .then(res => {
      return handleString(res)
    })
    .catch(err => {
      console.log('🚀 ~ :', err)
    })
}

/**
 * 获取字典颜色
 * @param type 字典类型
 * @param value 字典对应的值
 * @returns 返回颜色值
 */
export function getDictColor(type: string, value: string) {
  const appStore = useAppStore()
  const dictData = appStore.getDictOptions(type)
  if (dictData?.length) {
    const dictItem = dictData.find((item: any) => item.value === value)
    return dictItem?.color
  }
  appStore
    .fetchDictData(type)
    .then(res => {
      const dictItem = res.find((item: any) => item.value === value)
      return dictItem?.color || ''
    })
    .catch(err => err)
}
