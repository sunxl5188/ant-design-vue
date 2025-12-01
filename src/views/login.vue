<template>
  <div class="h-screen flex justify-center items-center flex-col">
    <a-space align="center">
      <span><SvgIcon name="logo" size="44px" /></span>
      <span class="font-bold text-3xl ml-2">Admin Pro</span>
    </a-space>
    <p class="text-sm pt-3 pb-4">
      Ant Design 是西湖区最具影响力的 Web 设计规范
    </p>
    <div class="w-80">
      <a-tabs v-model:activeKey="activeKey" centered>
        <a-tab-pane :key="1" tab="帐号密码登录" />
        <a-tab-pane :key="2" tab="手机号登录" />
      </a-tabs>
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        autoComplete="off"
        size="large"
      >
        <!-- 账号登陆 -->
        <template v-if="activeKey === 1">
          <a-form-item name="userName">
            <a-input
              v-model:value="formData.userName"
              placeholder="账户:admin"
              allowClear
            >
              <template #prefix><user-outlined /></template>
            </a-input>
          </a-form-item>
          <a-form-item name="password">
            <a-input-password
              v-model:value="formData.password"
              placeholder="密码:admin"
              allowClear
            >
              <template #prefix>
                <LockOutlined class="site-form-item-icon" />
              </template>
            </a-input-password>
          </a-form-item>
        </template>
        <template v-if="activeKey === 2">
          <a-form-item name="phone">
            <a-input
              v-model:value="formData.phone"
              placeholder="手机号"
              allowClear
            >
              <template #prefix><MobileOutlined /></template>
            </a-input>
          </a-form-item>
          <a-form-item name="code">
            <a-space>
              <a-input
                v-model:value="formData.code"
                placeholder="验证码"
                allowClear
              >
                <template #prefix><MailOutlined /></template>
              </a-input>
              <a-button>获取验证码</a-button>
            </a-space>
          </a-form-item>
        </template>
        <a-form-item>
          <div class="flex justify-between items-center w-full">
            <a-checkbox v-model:checked="formData.autoLogin">
              自动登录
            </a-checkbox>
            <span>
              还没有账户？
              <router-link to="/register">注册账户</router-link>
            </span>
          </div>
        </a-form-item>
        <a-form-item>
          <a-button type="primary" block @click="handleSubmit">登录</a-button>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="LoginPage">
import type { UnwrapRef } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'
import { useUserStore } from '@/store'
import { useModal } from '@/utils/useModal'

interface LoginPropType {
  userName: string
  password: string
  phone: string
  code: string
  autoLogin: boolean
}

const userStore = useUserStore()
const router = useRouter()
const { notify } = useModal()
const activeKey = ref<number>(1)
const formData: UnwrapRef<LoginPropType> = reactive({
  userName: 'admin',
  password: 'admin',
  phone: '',
  code: '',
  autoLogin: true
})

const rules: Record<string, Rule[]> = {
  userName: [{ required: true, message: '请输入帐户名' }],
  password: [{ required: true, message: '请输入密码' }],
  phone: [{ required: true, message: '请输入手机号' }],
  code: [{ required: true, message: '请输入验证码' }]
}

const formRef = ref()
const handleSubmit = (): void => {
  formRef.value
    .validate()
    .then(async () => {
      const res = await userStore.login(formData)
      if (res) {
        notify.success('登录成功')
        router.push('/')
      } else {
        notify.error('登录失败,请检查您的账户信息')
      }
    })
    .catch((err: any) => err)
}
</script>
