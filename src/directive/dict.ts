import type { App } from 'vue'
import { fetch } from '@/utils/request'
import { useAppStore } from '@/store'

async function handleDict(
  el: HTMLElement,
  binding: any,
  dictData: any,
  dictApi: string,
  dict: string,
  fieldNames: { label: string; value: string }
) {
  let dataList = dictData[dict] || []
  const value = binding.value[dict]
  if (!dataList.length) {
    const { code, data } = await fetch(dictApi, { type: dict })
    if (code === 200) {
      dataList = data || []
    }
  }

  let dictItem = ''
  dataList = dataList.map((item: any) => {
    return {
      label: item[fieldNames.label],
      value: item[fieldNames.value]
    }
  })
  // 缓存字典数据
  if (!dictData[dict]) {
    dictData.setDictData(dict, dataList)
  }
  if (Array.isArray(value)) {
    dictItem = dataList
      .filter((item: any) => binding.value[dict].includes(item.value))
      .map((i: any) => i[fieldNames.label] || '--')
      .join('、')
  } else {
    const obj: any = dataList.find(
      (item: any) => item.value === binding.value[dict]
    )
    dictItem = obj ? obj[fieldNames.label] || '--' : '--'
  }

  if (dictItem) {
    el.innerText = dictItem
  } else {
    el.innerText = '--'
    el.style.color = 'var(--van-gray-5)'
  }
}

export default {
  install(app: App) {
    /**
     * @字典指令
     * 使用方法：v-dict="{ dictType: value | [value], fieldNames: { label: 'name', value: 'code' } }"
     * dictType: 字典类型 必填
     * value: 需要转换的字典值 必填 字符或数组
     * fieldNames: 字段名映射 可选，默认{label:'label',value:'value'}
     */

    app.directive('dict', {
      mounted(el, binding) {
        const { dictData } = useAppStore()
        const dictApi = import.meta.env.VITE_DICT_API
        const [dict] = Object.keys(binding.value)
        let fieldNames = { label: 'label', value: 'value' }
        if (Object.keys(binding.value).includes('fieldNames')) {
          fieldNames = binding.value.fieldNames
        }
        if (dict && binding.value[dict]) {
          handleDict(el, binding, dictData, dictApi, dict, fieldNames)
        }
      }
    })
  }
}
