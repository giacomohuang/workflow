// mouse.js
import { ref, onMounted, onUnmounted } from 'vue'

// 按照惯例，组合式函数名以“use”开头
export function useMouse() {
  // 被组合式函数封装和管理的状态
  const mouseX = ref(0)
  const mouseY = ref(0)

  // 组合式函数可以随时更改其状态。
  function update(event) {
    mouseX.value = event.clientX
    mouseY.value = event.clientY
  }

  // 一个组合式函数也可以挂靠在所属组件的生命周期上
  // 来启动和卸载副作用
  onMounted(() => document.addEventListener('mousemove', update))
  onUnmounted(() => document.removeEventListener('mousemove', update))

  // 通过返回值暴露所管理的状态
  return { mouseX, mouseY }
}
