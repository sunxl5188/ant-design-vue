<template>
  <div class="h-screen flex justify-center items-center flex-col">
    <a-space align="center">
      <SvgIcon name="logo" size="44px" />
      <span class="font-bold text-3xl ml-2">Admin Pro</span>
    </a-space>
    <p class="text-sm pt-3 pb-4">
      Ant Design 是西湖区最具影响力的 Web 设计规范
    </p>
    <div class="w-80">
      <h1 class="font-black text-lg mb-4">注册账户</h1>
      <a-form
        ref="formRef"
        :model="formData"
        :rules="rules"
        autoComplete="off"
        size="large"
      >
        <a-form-item name="userName">
          <a-input
            v-model:value="formData.userName"
            placeholder="请输入账号"
            allowClear
          >
            <template #prefix><user-outlined /></template>
          </a-input>
        </a-form-item>
        <a-form-item name="password">
          <a-input-password
            v-model:value="formData.password"
            type="password"
            placeholder="至少6位密码，区分大小写"
            allowClear
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="confirmPassword">
          <a-input-password
            v-model:value="formData.confirmPassword"
            type="password"
            placeholder="确认密码"
            allowClear
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input-password>
        </a-form-item>
        <a-form-item name="phone">
          <a-input
            v-model:value="formData.phone"
            placeholder="11位手机号"
            allowClear
          >
            <template #prefix>
              <LockOutlined class="site-form-item-icon" />
            </template>
          </a-input>
        </a-form-item>
        <a-form-item name="code">
          <a-input-group>
            <a-row :gutter="8">
              <a-col :span="16">
                <a-input
                  v-model:value="formData.code"
                  placeholder="验证码"
                  allowClear
                >
                  <template #prefix>
                    <VerifiedOutlined />
                  </template>
                </a-input>
              </a-col>
              <a-col :span="8">
                <a-button>获取验证码</a-button>
              </a-col>
            </a-row>
          </a-input-group>
        </a-form-item>
        <a-form-item>
          <a-space direction="vertical" size="large" class="w-full">
            <a-button type="primary" block @click="handleSubmit">注册</a-button>
            <router-link to="/login" class="text-sm">
              使用已有账户登录
            </router-link>
          </a-space>
        </a-form-item>
      </a-form>
    </div>
  </div>
</template>

<script setup lang="ts" name="Register">
import type { UnwrapRef } from 'vue'
import type { Rule } from 'ant-design-vue/es/form'

interface LoginPropType {
  userName: string
  password: string
  confirmPassword: string
  phone: string
  code: string
}

//const router = useRouter()
const formData: UnwrapRef<LoginPropType> = reactive({
  userName: '',
  password: '',
  confirmPassword: '',
  phone: '',
  code: ''
})

const rules: Record<string, Rule[]> = {
  userName: [{ required: true, message: '请输入帐户名或邮箱地址' }],
  password: [
    { required: true, message: '请输入密码' },
    { min: 6, message: '密码长度不能少于6位' }
  ],
  confirmPassword: [
    { required: true, message: '请确认密码' },
    {
      validator: (_rule, value) => {
        if (value !== formData.password) {
          return Promise.reject('两次输入的密码不一致')
        }
        return Promise.resolve()
      },
      trigger: 'blur'
    }
  ],
  phone: [
    { required: true, message: '请输入手机号' },
    { pattern: /^1[3-9]\d{9}$/, message: '请输入有效的手机号' }
  ],
  code: [{ required: true, message: '请输入验证码' }]
}

const formRef = ref()
const handleSubmit = (): void => {
  formRef.value
    .validate()
    .then(() => {
      // 注册逻辑
    })
    .catch((err: any) => err)
}
</script>

<style scoped land="scss"></style>
