import type { NotificationArgsProps } from 'ant-design-vue/es/notification'

export interface modalType {
  info: (
    _content: string,
    _title?: string,
    _config?: Record<string, any>
  ) => Promise<any>
  success: (
    _content: string,
    _title?: string,
    _config?: Record<string, any>
  ) => Promise<any>
  error: (
    _content: string,
    _title?: string,
    _config?: Record<string, any>
  ) => Promise<any>
  warning: (
    _content: string,
    _title?: string,
    _config?: Record<string, any>
  ) => Promise<any>
  confirm: (
    _content: string,
    _title?: string,
    _config?: Record<string, any>
  ) => Promise<any>
}

export interface NotifyType {
  open: (
    _description: string,
    _message?: string,
    _config?: NotificationArgsProps
  ) => void
  success: (
    _description: string,
    _message?: string,
    _config?: NotificationArgsProps
  ) => void
  error: (
    _description: string,
    _message?: string,
    _config?: NotificationArgsProps
  ) => void
  info: (
    _description: string,
    _message?: string,
    _config?: NotificationArgsProps
  ) => void
  warning: (
    _description: string,
    _message?: string,
    _config?: NotificationArgsProps
  ) => void
  warn: (
    _description: string,
    _message?: string,
    _config?: NotificationArgsProps
  ) => void
}

export interface MessageType {
  success: (_content: string, _duration?: number, _onClose?: () => void) => void
  error: (_content: string, _duration?: number, _onClose?: () => void) => void
  info: (_content: string, _duration?: number, _onClose?: () => void) => void
  warning: (_content: string, _duration?: number, _onClose?: () => void) => void
  warn: (_content: string, _duration?: number, _onClose?: () => void) => void
  loading: (_content: string, _duration?: number, _onClose?: () => void) => void
  destroy: () => void
}
