import { ref } from 'vue'
import type { FormInstance } from 'ant-design-vue'
import { fetch } from '@/utils/request'
import { useAppStore } from '@/store'

// 获取字典数据，优先级: dict > api > options
async function getDictData(
  state: any,
  dict?: string,
  api?: string,
  params?: Record<string, any>,
  options?: Array<any>
) {
  const appStore = useAppStore()
  if (dict) {
    const dictOptions = appStore.getDictOptions(dict)
    if (dictOptions.length) {
      state.options = dictOptions
    } else {
      const data = await appStore.fetchDictData(dict)
      state.options = data
    }
  } else if (api) {
    try {
      const { code, data } = await fetch(api, params)
      if (code === 200) {
        state.options = data
      } else {
        state.options = []
      }
    } catch (err) {
      console.log('🚀 ~ :', err)
    }
  } else if (options) {
    state.options = options
  }
}

/**
 * 通用表单 hooks，支持表单实例、重置、校验、获取数据等
 */
export function useBaseForm<T extends object = any>() {
  const formRef = ref<FormInstance | null>(null)
  const formData = ref<T>({} as T)
  const loading = ref(false)

  // 重置表单
  function resetForm() {
    formRef.value?.resetFields()
    // 也可重置 formData
    // formData.value = {} as T
  }

  // 校验表单
  function validateForm(): Promise<T> {
    return new Promise((resolve, reject) => {
      formRef.value
        ?.validate()
        .then(() => resolve(formData.value))
        .catch(reject)
    })
  }

  // 设置表单数据
  function setFormData(data: Partial<T>) {
    formData.value = { ...formData.value, ...data }
  }

  return {
    formRef,
    formData,
    loading,
    resetForm,
    validateForm,
    setFormData,
    getDictData
  }
}
