import ClipboardJS from 'clipboard'
import { useAppStore } from '@/store/useAppStore'

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
 * @param dictType 字典类型
 * @param value 字典对应的值
 * @returns 返回名称
 */
export function getDictFilter(dictType: string, value: string): string {
  let result = '--'
  if (!dictType || !value) {
    return result
  }
  const appStore = useAppStore()
  const dictData = appStore.dictData[dictType] || []
  const dictItem = dictData.find((item: any) => item.value === value)
  if (dictItem) {
    result = dictItem.text || '--'
  }
  return result
}
