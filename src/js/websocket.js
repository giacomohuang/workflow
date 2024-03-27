import { customAlphabet } from 'nanoid'

let url = 'ws://127.0.0.1:8800' //请求的后端地址

let websocket = null //全局WebSocket对象
let lockReconnect = false // 网络断开重连
let wsCreateHandler = null // 创建连接

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6)

export function createWebsocket(fn) {
  try {
    if ('WebSocket' in window) {
      websocket = new WebSocket(`${url}/ws?token=${nanoid()}`)
    }
  } catch {
    reconnect()
    return
  }

  websocket.onopen = function (evt) {
    // websocket.send("连接成功");
    console.log('服务已连接', evt)
  }

  websocket.onmessage = function (evt) {
    var data = JSON.parse(evt.data)
    if (data.type === 'exit') {
      console.log('退出登录', evt)
    }
    fn(data)
  }
  websocket.onclose = function (evt) {
    console.log('服务连接关闭', evt)
  }
  websocket.onerror = function (evt) {
    console.log('连接出错', evt)
  }
}
/**
 *  异常处理
 * 处理可以检测到的异常，并尝试重新连接
 */
function reconnect() {
  if (lockReconnect) {
    return
  }
  console.log('reconnect')
  lockReconnect = true
  // 没链接上会一直连接，设置延迟，避免过多请求
  wsCreateHandler && clearTimeout(wsCreateHandler)
  wsCreateHandler = setTimeout(function () {
    console.log('-----websoket异常-------')
    createWebsocket()
    lockReconnect = false
  }, 1000)
}
export function closeWebsoket() {
  console.log('执行了关闭')
  websocket.close() //手动关闭websocket
}
