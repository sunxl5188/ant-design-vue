import type { modalType, NotifyType, MessageType } from '@/types/useModal'
import { Modal, notification, message as Message } from 'ant-design-vue'
import { t } from '@/i18n'

export function useModal() {
  const modal: modalType = {
    info: (content, title, config) => {
      return new Promise(resolve => {
        Modal.info({
          content,
          title: title || t('a.a6'),
          onOk: (close: any) => {
            resolve(true)
            close()
          },
          ...config
        })
      })
    },
    success: (content, title, config) => {
      return new Promise(resolve => {
        Modal.success({
          content,
          title: title || t('a.a6'),
          onOk: (close: any) => {
            resolve(true)
            close()
          },
          ...config
        })
      })
    },
    error: (content, title, config) => {
      return new Promise(resolve => {
        Modal.error({
          content,
          title: title || t('a.a6'),
          onOk: (close: any) => {
            resolve(true)
            close()
          },
          ...config
        })
      })
    },
    warning: (content, title, config) => {
      return new Promise(resolve => {
        Modal.warning({
          content,
          title: title || t('a.a6'),
          onOk: (close: any) => {
            resolve(true)
            close()
          },
          ...config
        })
      })
    },
    confirm: (content, title, config) => {
      return new Promise(resolve => {
        Modal.confirm({
          content,
          title: title || t('a.a6'),
          onOk: (close: any) => {
            resolve(true)
            close()
          },
          onCancel: (close: any) => {
            resolve(false)
            close()
          },
          ...config
        })
      })
    }
  }

  const notify: NotifyType = {
    open: (description, message, config) => {
      notification.open({
        message: message || t('a.a6'),
        description,
        ...config
      })
    },
    success: (description, message, config) => {
      notification.success({
        message: message || t('a.a6'),
        description,
        ...config
      })
    },
    error: (description, message, config) => {
      notification.error({
        message: message || t('a.a6'),
        description,
        ...config
      })
    },
    info: (description, message, config) => {
      notification.info({
        message: message || t('a.a6'),
        description,
        ...config
      })
    },
    warning: (description, message, config) => {
      notification.warning({
        message: message || t('a.a6'),
        description,
        ...config
      })
    },
    warn: (description, message, config) => {
      notification.warn({
        message: message || t('a.a6'),
        description,
        ...config
      })
    }
  }

  const message: MessageType = {
    success: (content, duration, onClose) => {
      Message.success({ content, duration: duration || 3, onClose })
    },
    error: (content, duration, onClose) => {
      Message.error({ content, duration: duration || 3, onClose })
    },
    info: (content, duration, onClose) => {
      Message.info({ content, duration: duration || 3, onClose })
    },
    warning: (content, duration, onClose) => {
      Message.warning({ content, duration: duration || 3, onClose })
    },
    warn: (content, duration, onClose) => {
      Message.warn({ content, duration: duration || 3, onClose })
    },
    loading: (content, duration = 3) => {
      Message.loading({ content, duration })
    },
    destroy: () => {
      Message.destroy()
    }
  }

  return {
    modal,
    notify,
    message
  }
}
