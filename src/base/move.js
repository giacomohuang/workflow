// 鼠标移动滚动位置类
class Drag {
  constructor(vm) {
    this.dragWrap = vm // 要挂载的容器
    this._dom = {}
    this._x = 0
    this._y = 0
    this._top = 0
    this._left = 0
    this.move = false
    this.down = false
    this.init.apply(this, arguments)
  }

  // 绑定事件
  init() {
    this.bindEvent()
  }

  // 给要素增加鼠标事件mousedown，mouseup，mousemove
  bindEvent() {
    var t = this
    this.dragWrap.addEventListener('mousedown', function (e) {
      // console.log('move.js:mousedown')
      // e && e.preventDefault()
      // e.stopPropagation()
      if (!t.move) {
        t.move = false
        t.down = true
        t._x = e.clientX
        t._y = e.clientY
        t._top = t.dragWrap.scrollTop
        t._left = t.dragWrap.scrollLeft
        document.addEventListener('mouseup', up, true)
      }
    })

    this.dragWrap.addEventListener('mousemove', function (e) {
      if (t.down) {
        // e && e.preventDefault()
        // e.stopPropagation()
        t.move = true
        let x = t._x - e.clientX
        let y = t._y - e.clientY
        t.dragWrap.scrollLeft = t._left + x
        t.dragWrap.scrollTop = t._top + y
      }
    })
    function up() {
      // console.log('move.js:mouseup1')
      // ev && ev.preventDefault()
      // ev.stopPropagation()
      t.move = false
      t.down = false
      document.getElementById('node-panel').style.display = 'none'
      document.removeEventListener('mouseup', up, true)
    }
  }
}
export default Drag
