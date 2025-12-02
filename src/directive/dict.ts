import type { App } from 'vue'
import { fetch } from '@/utils/request'

export default {
  install(app: App) {
    /**
     * @字典指令
     * 使用方法：v-dict="{ dictType: value | [value], fieldNames: { text: 'name', value: 'code' } }"
     * dictType: 字典类型 必填
     * value: 需要转换的字典值 必填 字符或数组
     * fieldNames: 字段名映射 可选，默认{text:'text',value:'value'}
     */
    app.directive('dict', {
      async mounted(el, binding) {
        const dictApi = import.meta.env.VITE_DICT_API
        const [dict] = Object.keys(binding.value)
        let fieldNames = { text: 'text', value: 'value' }
        if (Object.keys(binding.value).includes('fieldNames')) {
          fieldNames = binding.value.fieldNames
        }
        if (dict && binding.value[dict]) {
          const value = binding.value[dict]
          const { code, data } = await fetch(dictApi, { dictType: dict })
          if (code === 200) {
            let dictItem = ''
            const dataList = data.map((item: any) => {
              return {
                text: item[fieldNames.text],
                value: item[fieldNames.value]
              }
            })
            if (value instanceof Array) {
              dictItem = dataList
                .filter((item: any) => binding.value[dict].includes(item.value))
                .map((i: any) => i.text || '--')
                .join('、')
            } else {
              dictItem =
                dataList.find((item: any) => item.value === binding.value[dict])
                  .text || '--'
            }

            if (dictItem) {
              el.innerText = dictItem
            } else {
              el.innerText = '--'
              el.style.color = 'var(--van-gray-5)'
            }
          }
        }
      }
    })
  }
}
