import SockJS from 'sockjs-client/dist/sockjs.min.js'
import Stomp from 'stompjs'

const stompManager = {
  url: 'http://192.168.170.128:8082/WebSocket', // 连接地址（前后端自行定义）
  header: {}, // 连接header
  checkInterval: null, //断线重连时 检测连接是否建立成功
  websocket: null as any, // SockJS实例
  stompClient: null as any, // Stomp客户端实例
  listenerList: [] as any, //监听器列表，断线重连时 用于重新注册监听（主要是在其他页面后添加的订阅）
  isReConnect: true, // 是否需要重连（可根据配置自行定义是否重连）
  init(header = {}) {
    console.log('stompManager---init-----', this)
    // header中的内容根据需要进行传递,例：{userId: store.state.user.userId,type: 'WEB'}
    this.header = header
    this.listenerList = []
    this.connect()
  },
  connect() {
    if (
      this.stompClient !== null &&
      this.websocket.readyState === SockJS.OPEN
    ) {
      // 已连接
      this.stompClient.disconnect(() => {
        this.connect()
      })
    } else if (
      this.stompClient !== null &&
      this.websocket.readyState === SockJS.CONNECTING
    ) {
      // 连接中
      console.log('连接正在建立')
    }

    this.websocket = new SockJS(this.url)

    // 获取STOMP子协议的客户端对象
    const stompClient = Stomp.over(this.websocket)
    stompClient.debug = () => null //关闭控制台打印
    stompClient.heartbeat.outgoing = 20000
    stompClient.heartbeat.incoming = 0 //客户端不从服务端接收心跳包
    // 向服务器发起websocket连接
    stompClient.connect(
      this.header, //此处注意更换自己的用户名，最好以参数形式带入
      (frame: any) => {
        console.log('链接成功！', frame)
        this.listenerList.forEach((item: any, index: number) => {
          this.listenerList[index].subscription = this.stompClient.subscribe(
            item.topic,
            item.callback
          )
        })

        // 订阅
      },
      (err: any) => {
        // 第一次连接失败和连接后断开连接都会调用这个函数 此处调用重连，主动调用disconnect不会走这里
        console.log('stompClient-----connect---error----', err)
        if (this.isReConnect) {
          // 需要重连
          setTimeout(() => {
            this.connect()
          }, 2000)
        }
      }
    )
    this.stompClient = stompClient
  },
  disconnect() {
    if (this.stompClient && this.stompClient.connected) {
      // 当前已连接
      this.stompClient.disconnect(() => {
        console.log('主动断开连接，不重连---------')
      })
    }
  },
  // 外部调用，发送消息
  send(
    topic: string,
    header: any,
    message: any
  ): Promise<{ code: number; msg: string }> {
    return new Promise((resolve, reject) => {
      if (this.stompClient && this.stompClient.connected) {
        this.stompClient.send(topic, header || {}, JSON.stringify(message))
        resolve({ code: 200, msg: '发送成功' })
      } else {
        reject({ code: 0, msg: '未连接' })
      }
    })
  },
  // 外部调用，解除订阅
  unsubscribe(topic: string) {
    for (let i = 0; i < this.listenerList.length; i++) {
      if (this.listenerList[i].topic === topic) {
        const subscription = this.listenerList[i].subscription
        if (subscription) {
          subscription.unsubscribe()
        }
        this.listenerList.splice(i, 1)
        console.log('解除订阅：' + topic + ' size:' + this.listenerList.length)
        break
      }
    }
  },
  // 外部调用，订阅
  subscribe(topic: string, callback: (_: any) => void) {
    if (this.stompClient && this.stompClient.connected) {
      if (this.listenerList.some((item: any) => item.topic === topic)) {
        // 之前有订阅过，需要解除订阅
        this.unsubscribe(topic)
      }
      const subscription = this.stompClient.subscribe(topic, callback)
      this.listenerList.push({
        topic: topic,
        callback: callback,
        subscription: subscription
      })
    } else {
      let flag = false
      this.listenerList.some((item: any) => {
        if (item.topic === topic) {
          flag = true
          item.callback = callback
          console.log('订阅：' + topic + ' size:' + this.listenerList.length)
          return true
        }
      })
      if (!flag) {
        // 之前没有监听此topic
        this.listenerList.push({
          topic: topic,
          callback: callback
        })
      }
    }
  }
}

export default stompManager
