import SvgIcon from './SvgIcon.vue'
;(SvgIcon as any).install = (Vue: any) => {
  Vue.component((SvgIcon as any).extendOptions.name, SvgIcon)
}
export default SvgIcon
