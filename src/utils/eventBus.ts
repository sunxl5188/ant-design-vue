import mitt from 'mitt'

type Events = {
  foo: string // 这里可以定义更多事件及其对应的数据类型
}

const bus = mitt<Events>()

export default bus
export { bus }
