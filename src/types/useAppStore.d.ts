/**
 * 主题变量类型
 */
export interface ThemeTokenType {
  blue: string
  purple: string
  cyan: string
  green: string
  magenta: string
  pink: string
  red: string
  orange: string
  yellow: string
  volcano: string
  geekblue: string
  gold: string
  lime: string
  colorPrimary: string
  colorSuccess: string
  colorWarning: string
  colorError: string
  colorInfo: string
  colorTextBase: string
  colorBgBase: string
  fontFamily: string
  fontSize: number
  lineWidth: number
  lineType: string
  motionUnit: number
  motionBase: number
  motionEaseOutCirc: string
  motionEaseInOutCirc: string
  motionEaseOut: string
  motionEaseInOut: string
  motionEaseOutBack: string
  motionEaseInBack: string
  motionEaseInQuint: string
  motionEaseOutQuint: string
  borderRadius: number
  sizeUnit: number
  sizeStep: number
  sizePopupArrow: number
  controlHeight: number
  zIndexBase: number
  zIndexPopupBase: number
  opacityImage: number
  wireframe: string
}
/**
 * 侧边栏标签页类型
 */
export interface SiderTabType {
  title: string
  label: string
  key: string
  icon?: any
  spin?: boolean
  children?: Array<SiderTabType>
}

/**
 * 用户信息类型
 */
export interface UserInfoType {
  createBy?: string
  createTime?: string
  updateBy?: string | null
  updateTime?: string | null
  remark?: string
  userId?: number
  deptId?: number
  userName?: string
  nickName?: string
  email?: string
  phone?: string
  sex?: string
  avatar?: string
  status?: string
  delFlag?: string
  loginIp?: string
  loginDate?: string
}
