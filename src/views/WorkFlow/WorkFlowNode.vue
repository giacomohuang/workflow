<template>
  <!-- node-group -->
  <div class="node-group" v-for="(item1, index1) in props.item.group" :key="item1.id">
    <div class="wrap">
      <div class="line-top-v" v-if="item1.type != 0 && item1.type != 5 && item1.type !== 7"></div>
      <div class="arrow-v" v-if="item1.type != 0 && item1.type != 5 && item1.type !== 7"></div>

      <div v-if="item1.type != 5 && item1.type != 7" class="node" :class="'type' + item1.type">
        <div class="title" :class="{ default: item1.default }">
          <div class="inputbox">
            <input v-model="item1.title" @mousedown.stop="" @click.stop="" @mouseup.stop="" />
            <div class="clear" v-draggable @click.stop="clearText($event, item1)"><Icon id="#icon-remove"></Icon></div>
          </div>
          <div class="name" v-draggable @click.stop="editNodeTitle($event, item1)">
            <span :placeholder="item1.id">{{ item1.title }}</span>
            <Icon id="#icon-edit"></Icon>
          </div>
          <div class="tools">
            <div class="remove" v-draggable @click.stop="removeNode($event, item1.id)" v-if="item1.type !== 0 && item1.type !== 1"><Icon id="#icon-remove"></Icon></div>
          </div>
        </div>
        <div class="body" v-draggable @click.stop="editNode($event, item1)">
          <div class="detail">
            <div class="item">{{ item1.body ? item1.body : '请设置' + getNodeTypeName(item1.type) + '人' }}</div>
          </div>
          <div class="set"><Icon id="#icon-arrow-right"></Icon></div>
        </div>
      </div>
      <div class="line-bottom-v" v-if="item1.type != 1" :class="{ half: item1.type == 5 || item1.type == 7 }">
        <template v-if="item1.type != 5 && item1.type !== 7">
          <div class="add-btn" v-draggable @click.stop="showPanel($event, item1.id)">
            <Icon id="#icon-plus"></Icon>
          </div>
        </template>
      </div>

      <template v-if="item1.branches">
        <!-- start of branches -->
        <div class="outline">
          <div v-if="item1.type === 5" class="node type5" v-draggable @click.stop="insertBranch($event, item1.id, 5, false)"><Icon id="#icon-plus"></Icon> 添加条件分支</div>
          <div v-if="item1.type === 7" class="node type7" v-draggable @click.stop="insertBranch($event, item1.id, 7, false)"><Icon id="#icon-plus"></Icon> 添加并行节点</div>
          <div class="line-top-v"></div>
          <div class="node-group branches">
            <div class="wrap" v-for="(item2, index2) in item1.branches" :key="item2.id">
              <div class="line-h" :class="{ first: index2 == 0, last: index2 == item1.branches.length - 1 }"></div>
              <div class="line-top-v"></div>
              <div class="line-top-v" v-if="item1.type === 5"></div>

              <!--start of condition node-->
              <div class="node-group" v-if="item2.type === 6">
                <div class="wrap">
                  <div class="node" :class="'type' + item2.type">
                    <div class="title" :class="{ default: item2.default }">
                      <div class="inputbox">
                        <input v-model="item2.title" @mousedown.stop="" @click.stop="" @mouseup.stop="" />
                        <div class="clear" v-draggable @click.stop="clearText($event, item2)"><Icon id="#icon-remove"></Icon></div>
                      </div>
                      <div class="name" v-draggable @click.stop="editNodeTitle($event, item2)">
                        <span :placeholder="item2.id">{{ item2.title }}</span>
                        <Icon id="#icon-edit"></Icon>
                      </div>
                      <div class="priority">{{ 'P' + item2.priority }}</div>
                      <div class="tools" v-if="!item2.default">
                        <div class="remove" v-draggable @click.stop="removeNode($event, item2.id)"><Icon id="#icon-remove"></Icon></div>
                      </div>
                    </div>
                    <div class="body" v-draggable @click.stop="editNode($event, item2)">
                      <div class="detail">
                        <div class="item">{{ item2.body ? item2.body : '请设置条件' }}</div>
                      </div>
                      <div class="set"><Icon id="#icon-arrow-right"></Icon></div>
                    </div>
                  </div>
                  <div class="line-bottom-v">
                    <div class="add-btn" v-draggable @click.stop="showPanel($event, item2.id)">
                      <Icon id="#icon-plus"></Icon>
                    </div>
                  </div>
                </div>
              </div>
              <!--end of condition node-->
              <!--递归 other node-->
              <WorkFlowNode :item="item2" :flag="false"></WorkFlowNode>
              <div class="line-bottom-v half"></div>
            </div>
          </div>

          <div class="line-h" :class="{ first: index1 == 0, last: index1 == item1.branches.length - 1 }"></div>
          <div class="line-top-v"></div>
        </div>

        <div class="line-bottom-v">
          <div class="add-btn" v-draggable @click.stop="showPanel($event, item1.id)">
            <Icon id="#icon-plus"></Icon>
          </div>
        </div>

        <!-- end of branches -->
      </template>
    </div>
  </div>

  <div id="node-panel" v-if="flag === true" @mousedown.stop="" @mouseup.stop="" @click.stop="">
    <div class="item" @click.stop="createNode(2)">
      <div class="icon" style="background: #eda763"><Icon id="#icon-approve"></Icon></div>
      <div>审批</div>
    </div>
    <div class="item" @click.stop="createNode(3)">
      <div class="icon" style="background: #ceb0d2"><Icon id="#icon-handle"></Icon></div>
      <div>办理</div>
    </div>
    <div class="item" @click.stop="createNode(4)">
      <div class="icon" style="background: #f29999"><Icon id="#icon-carbon-copy"></Icon></div>
      <div>抄送</div>
    </div>
    <div class="item" @click.stop="createNode(5)">
      <div class="icon" style="background: #c8adad"><Icon id="#icon-condition"></Icon></div>
      <div>条件</div>
    </div>
    <div class="item" @click.stop="createNode(7)">
      <div class="icon" style="background: #b0c6cd"><Icon id="#icon-parallel"></Icon></div>
      <div>并行</div>
    </div>
  </div>
</template>

<script setup>
import { inject, onMounted } from 'vue'
import Icon from '../../components/Icon.vue'
import { customAlphabet } from 'nanoid'

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 6)
const props = defineProps(['item', 'flag'])
const workflow_data = inject('workflow_data')
const active_nodeid = inject('active_nodeid')
const editing_node = inject('editing_node')
const drawer = inject('drawer')
let dragged = false
let title_undo_text = ''

// 自定义指令，检测鼠标按下后是否拖动，解决拖动和点击事件的冲突
const vDraggable = {
  mounted: (el) => {
    var offsetX = 0
    var offsetY = 0
    function onMouseDown(ev) {
      dragged = false
      offsetX = ev.clientX
      offsetY = ev.clientY
      // console.log('----mousedown----', offsetX, offsetY)
      el.addEventListener('mouseup', onMouseUp)
    }
    function onMouseUp(ev) {
      if (Math.abs(offsetX - ev.clientX) > 5 || Math.abs(offsetY - ev.clientY) > 5) {
        // console.log('----moved----', ev.clientX, ev.clientY)
        dragged = true
      }
      el.removeEventListener('mouseup', onMouseUp)
    }
    el.addEventListener('mousedown', onMouseDown)
  }
}

function getNodeTypeName(type) {
  var name = ''
  switch (type) {
    case 0:
      name = '发起'
      break
    case 1:
      name = '抄送'
      break
    case 2:
      name = '审批'
      break
    case 3:
      name = '办理'
      break
    case 4:
      name = '抄送'
      break
  }
  return name
}

function editNode(ev, node) {
  if (dragged) return
  // console.log(id)
  drawer.value = true
  editing_node.value = node
}

function showPanel(ev, id) {
  if (dragged) return
  console.log('showPanel:', id)
  const panel = document.getElementById('node-panel')
  let actualLeft = ev.currentTarget.offsetLeft
  let actualTop = ev.currentTarget.offsetTop
  let current = ev.currentTarget.offsetParent
  while (current !== null && current.id !== 'nodes') {
    actualLeft += current.offsetLeft
    actualTop += current.offsetTop
    current = current.offsetParent
  }
  panel.style.top = actualTop - 25 + 'px'
  panel.style.left = actualLeft + 40 + 'px'
  active_nodeid.value = id
  document.getElementById('node-panel').style.display = 'flex'
}

function createNode(type) {
  console.log(dragged)
  if (dragged) return
  if (type === 5 || type === 7) {
    insertBranch(null, active_nodeid.value, type, true)
  } else {
    insertNode(null, active_nodeid.value, type)
  }
  document.getElementById('node-panel').style.display = 'none'
}

function insertNode(ev, id, type) {
  if (dragged) return
  let data = { id: nanoid(), type: type, title: getNodeTypeName(type), body: '', approver: '' }
  insertNodeAfterId(workflow_data.value, id, data)

  function insertNodeAfterId(json, targetId, newNode) {
    // 遍历 JSON 结构中的节点
    for (let i = 0; i < json.group.length; i++) {
      const node = json.group[i]
      // 如果当前节点的 id 匹配目标 id，就在该节点后面插入新的节点
      if (node.id === targetId) {
        json.group.splice(i + 1, 0, newNode)
        break
      }

      // 如果当前节点是一个包含条件分支的节点，则递归调用该函数，继续寻找目标 id

      if (node.type === 5 || node.type === 7) {
        for (let j = 0; j < node.branches.length; j++) {
          console.log('+++', node.branches[j])
          console.log(j + ':' + node.branches[j].id)
          if (node.branches[j].id === targetId) {
            // 在group的头部插入
            node.branches[j].group.splice(0, 0, newNode)
          }
          const Branch = node.branches[j]
          if (Branch.group) {
            insertNodeAfterId(Branch, targetId, newNode)
          }
        }
      }
    }
  }
  // console.log(workflow_data.value)
}

function insertBranch(ev, id, type, create) {
  if (dragged) return
  let data_temp = {
    id: nanoid(),
    type: 6,
    title: '条件',
    priority: 1,
    group: [{ id: nanoid(), type: 2, title: '审批', body: '' }]
  }
  let data_default = {
    id: nanoid(),
    type: 6,
    title: '默认条件',
    priority: 2,
    default: true,
    group: [{ id: nanoid(), type: 2, title: '审批', body: '' }]
  }
  let data_default_parallel = {
    group: [{ id: nanoid(), type: 2, title: '审批', body: '' }]
  }

  findNode(workflow_data.value, id, create)

  function findNode(json, targetId, flag) {
    // 如果在条件分支节点下创建新的条件/并行分支
    if (json.id === targetId) {
      if (type === 5) {
        let n = { id: nanoid(), type: 5 }
        console.log(n)
        n.branches = [data_temp, data_default]
        json.group.splice(0, 0, n)
      } else if (type === 7) {
        let n = { id: nanoid(), type: 7 }
        n.branches = [data_default_parallel]
        json.group.splice(0, 0, n)
      }
    }
    for (let i = 0; i < json.group.length; i++) {
      const node = json.group[i]
      if (node.id === targetId) {
        console.log('hit')
        if (type === 5) {
          // 是否新建分支
          if (flag) {
            let n = { id: nanoid(), type: 5 }
            n.branches = [data_temp, data_default]
            json.group.splice(i + 1, 0, n)
          } else {
            data_temp.priority = node.branches.length
            node.branches.splice(node.branches.length - 1, 0, data_temp)
            // 修改默认条件的优先级
            node.branches[node.branches.length - 1].priority = node.branches.length
            console.log(node)
          }
        } else if (type === 7) {
          // 是否新建分支
          if (flag) {
            let n = { id: nanoid(), type: 7 }
            n.branches = [data_default_parallel]
            json.group.splice(i + 1, 0, n)
          } else {
            // 在末尾增加一个新节点
            node.branches.splice(node.branches.length, 0, data_default_parallel)
          }
        }
        break
      }
      // 如果当前节点是一个包含条件分支的节点，则递归调用该函数，继续寻找目标 id
      if (node.branches) {
        for (let j = 0; j < node.branches.length; j++) {
          const Branch = node.branches[j]
          findNode(Branch, targetId, flag)
        }
      }
    }
  }
}

function removeNode(ev, id) {
  if (dragged) return
  removeNodeById(workflow_data.value, id)
  function removeNodeById(json, targetId) {
    if (json.group) {
      for (let i = 0; i < json.group.length; i++) {
        const node = json.group[i]
        // 如果当前节点的 id 匹配目标 id，删除
        if (node.id === targetId) {
          // console.log(node.id)
          json.group.splice(i, 1)
          break
        }

        // 如果当前节点是一个包含条件分支的节点，则递归调用该函数，继续寻找目标 id
        if (node.type === 5 || node.type === 7) {
          for (let j = 0; j < node.branches.length; j++) {
            if (node.branches[j].id === targetId) {
              // 处理条件分支节点
              if (node.type === 5) {
                //如果只剩下一个自定义条件，则删除整个条件节点
                if (node.branches.length == 2) {
                  json.group.splice(i, 1)
                }
                // 如果大于1个节点，直接删除
                else {
                  node.branches.splice(j, 1)
                  renumber(node.branches)
                }
              }
            } else {
              removeNodeById(node.branches[j], targetId)
              if (node.type === 7) {
                if (node.branches[j].group.length === 0) {
                  // console.log('hit', j)
                  node.branches.splice(j, 1)
                }
                if (node.branches.length === 0) {
                  json.group.splice(i, 1)
                }
              }
            }
          }
        }
      }
    }

    function renumber(data) {
      console.log('renumber', data)
      for (let i = 0; i < data.length; i++) {
        data[i].priority = i + 1
      }
    }
  }
}
function clearText(ev, json) {
  if (dragged) return
  console.log(ev.currentTarget.offsetParent)
  ev.currentTarget.previousElementSibling.focus()
  json.title = ''
}

function editNodeTitle(ev, json) {
  if (dragged) return
  // console.log('aaaaaa', json)
  const el = ev.currentTarget.previousElementSibling
  el.style.display = 'flex'
  el.children[0].focus()

  document.addEventListener('mousedown', onMouseDown)
  document.addEventListener('keydown', onKeyDown)
  title_undo_text = ''
  title_undo_text = json.title

  function onMouseDown(event) {
    console.log('edit:mouseddwn', isOutside(event))
    if (isOutside(event)) {
      document.addEventListener('mouseup', onMouseUp)
    }
  }

  function onKeyDown(event) {
    // 记录修改前的值，用于回滚
    const key = event.keyCode
    // 回车：提交
    if (key === 13) {
      el.style.display = 'none'
      document.removeEventListener('keydown', onKeyDown)
    }
    // ESC：回滚
    if (key === 27) {
      console.log('undo:', title_undo_text)
      json.title = title_undo_text
      el.style.display = 'none'
      document.removeEventListener('keydown', onKeyDown)
    }
  }
  function onMouseUp(event) {
    console.log('edit:mouseup')
    if (isOutside(event)) {
      el.style.display = 'none'
      document.removeEventListener('mouseup', onMouseUp)
      document.removeEventListener('mousedown', onMouseDown)
      document.removeEventListener('keydown', onKeyDown)
    }
  }

  function isOutside(event) {
    const x = event.clientX
    const y = event.clientY
    let bound = el.getBoundingClientRect()
    // console.log(x, y, bound.x, bound.y, bound.x + bound.width, bound.y + bound.height)
    if (x < bound.x || x > bound.x + bound.width || y < bound.y || y > bound.y + bound.height) {
      return true
    } else {
      return false
    }
  }
}

onMounted(() => {})
</script>

<style scoped lang="scss">
.node-group {
  display: flex;
  justify-content: top;
  position: relative;
  &:last-child {
    flex-grow: 1;
  }
}

.outline {
  border: 2px dashed rgb(218, 143, 68);
  flex-direction: column;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 20px;
}

.wrap {
  display: flex;
  flex-direction: column;
  justify-content: top;
  align-items: center;
  position: relative;
}

.node {
  width: 200px;
  border-radius: 8px;
  padding: 4px;
  margin: 0 20px;
  cursor: default;
  &.type0 {
    background: #b3bcd9;
    &:hover {
      box-shadow: 0px 0px 8px 0 rgba(63, 129, 199, 0.5);
    }
  }
  // 办结
  &.type1 {
    background: #b3bcd9;
    &:hover {
      box-shadow: 0px 0px 8px 0 rgba(63, 129, 199, 0.5);
    }
  }

  // 审批
  &.type2 {
    background: #eda763;
    &:hover {
      box-shadow: 0px 0px 8px 0 rgba(255, 141, 1, 0.5);
    }
  }

  // 办理
  &.type3 {
    background: #ceb0d2;
    &:hover {
      box-shadow: 0px 0px 8px 0 rgba(241, 79, 227, 0.5);
    }
  }

  // 抄送
  &.type4 {
    background: #f29999;
    &:hover {
      box-shadow: 0px 0px 8px 0 rgba(241, 79, 125, 0.5);
    }
  }

  // 添加条件分支按钮
  &.type5,
  // 添加并行分支按钮
  &.type7 {
    cursor: pointer;
    position: absolute;
    z-index: 2;
    top: 40px;
    background: #fff;
    color: #37f;
    width: 100px;
    line-height: 1.8;
    font-size: 12px;
    text-align: center;
    border-radius: 15px;
    border: 1px solid #3377ff00;
    box-shadow: 2px 2px 4px 0 rgba(84, 85, 90, 0.158);
    &:hover {
      border: 1px solid #3377ff;
      box-shadow: 0px 0px 8px 0 rgba(63, 129, 199, 0.5);
    }
  }

  // 条件分支
  &.type6 {
    background: #fff;
    &:hover {
      box-shadow: 0px 0px 8px 0 rgba(145, 145, 145, 0.5);
    }
    .title {
      color: #000;
      padding: 0 3px 3px 0px;
      border-bottom: 1px solid rgb(236, 241, 242);
      &.default {
        color: rgb(80, 80, 80);
        display: flex;
        justify-content: space-between;
      }
      &:hover {
        .remove > svg {
          font-size: 12px;
          color: #333;
        }
      }
    }
  }

  .title {
    position: relative;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    line-height: 1.5;
    height: 24px;
    margin: 0px 0px 3px 0px;
    color: #fff;
    background: inherit;

    &:hover {
      .tools {
        display: flex;
      }
    }

    .inputbox {
      display: none;
      align-content: space-between;
      align-items: center;
      position: absolute;
      z-index: 15;
      width: 100%;
      left: 0;
      // background: #ccc;
      background: #fff;
      border-radius: 3px;

      input {
        width: 100%;
        margin-right: 15px;
        // z-index: 20;
        border-radius: 3px;
        border: 0;
        outline: 0;
        box-shadow: none;
      }
      .clear {
        cursor: pointer;
        position: absolute;
        right: 3px;
        height: 12px;
        width: 12px;
        color: #fff;
        font-size: 8px;
        border-radius: 50%;
        background: #888;
        display: flex;
        align-items: center;
        justify-content: center;
        &:hover {
          background: #37f;
        }
      }
    }

    .name {
      display: flex;
      align-items: center;
      padding: 2px 4px;

      border-radius: 5px;
      cursor: pointer;
      z-index: 12;
      &:hover,
      &:active {
        background: #00000010;
        > svg {
          display: block;
        }
      }

      > span {
        overflow: hidden;
        white-space: nowrap;
        text-overflow: ellipsis;
        max-width: 120px;
        min-width: 120px;
      }
      > svg {
        display: none;
        font-size: 14px;
      }
    }
    .priority {
      padding: 2px 6px;
      color: #fff;
      border-radius: 8px;
      line-height: 1;
      font-family: Arial, Helvetica, sans-serif;
      background: #e49a9a;
    }

    .tools {
      display: none;
      justify-content: right;
      background: inherit;
      position: absolute;
      right: 0;
      width: 100%;
      color: #000;
      // padding: 2px 0;

      .remove {
        cursor: pointer;
        border-radius: 4px;
        padding: 4px;
        //
        display: flex;
        justify-content: center;
        align-items: center;
        &:hover,
        &:active {
          background: #00000010;
        }
        > svg {
          font-size: 12px;
          color: #fff;
        }
      }
    }
  }

  .body {
    cursor: default;
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-grow: 1;
    padding: 8px;
    background: #fff;
    border-radius: 4px;
    font-size: 14px;
    min-height: 50px;
    cursor: pointer;
  }
  .detail {
    overflow: hidden;
    .item {
      line-height: 1.8;
      color: rgb(40, 51, 62);
    }
  }
  .set {
    padding-left: 8px;
    font-size: 12px;
  }
}

.line-bottom-v {
  width: 1px;
  height: 60px;
  background-color: #afaacb;
  flex-basis: auto;
  display: block;
  flex-grow: 1;
  &.half {
    height: 30px;
  }
}

.line-top-v {
  width: 1px;
  height: 25px;
  background-color: #afaacb;
}

.line-h {
  content: '';
  line-height: 1px;
  width: 100%;
  height: 1px;
  background-color: #afaacb;
}

.branches {
  // border: 2px dashed orange;
  // padding: 20px 20px;
  .line-h.first::before {
    content: '';
    line-height: 1px;
    width: 50%;
    height: 1px;
    top: 0;
    left: 0;
    background-color: #f0f0f2;
    position: absolute;
  }
  .line-h.last::after {
    content: '';
    line-height: 1px;
    width: 50%;
    height: 1px;
    top: 0;
    right: 0;
    background-color: #f0f0f2;
    position: absolute;
  }
}

.branches > .wrap {
  &:first-child::before {
    content: '';
    top: 100%;
    line-height: 1px;
    width: 50%;
    height: 1px;
    left: 0;
    background-color: #f0f0f2;
    position: absolute;
  }
  &:last-child::after {
    content: '';
    top: 100%;
    line-height: 1px;
    width: 50%;
    height: 1px;
    right: 0;
    background-color: #f0f0f2;
    position: absolute;
  }
}

.arrow-v {
  width: 10px;
  height: 10px;
  transform: rotate(180deg);
  border-bottom: 10px solid #afaacb;
  border-right: 5px solid transparent;
  border-left: 5px solid transparent;
  background-color: #f0f0f200;
}

.add-btn {
  display: flex;
  z-index: 2;
  cursor: pointer;
  justify-content: center;
  align-items: center;
  position: relative;
  width: 30px;
  height: 30px;
  border-radius: 50%;
  background: #fff;
  border: 1px solid #3377ff00;
  left: -15px;
  top: calc(50%);
  font-size: 16px;
  color: #37f;
  box-shadow: 2px 2px 4px 0 rgba(84, 85, 90, 0.158);
  &:hover,
  &:active {
    border: 1px solid #3377ff;
    box-shadow: 0px 0px 10px 0 rgba(63, 129, 199, 0.5);
  }
}

#node-panel {
  transform-origin: 0 center;
  display: none;
  align-items: center;
  justify-content: center;
  position: absolute;
  border-radius: 10px;
  background: #fff;
  z-index: 101;
  width: fit-content;
  height: fit-content;
  padding: 4px 10px;
  box-shadow: 2px 2px 4px 0 rgba(84, 85, 90, 0.158);
  div {
    font-size: 12px;
  }
  .item {
    position: relative;
    display: flex;
    padding: 6px;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    cursor: pointer;
    &:hover {
      .icon {
        box-shadow: 0px 0px 10px 0 rgba(173, 173, 173, 0.5);
      }
    }
    .icon {
      border-radius: 50%;
      padding: 4px;
      // display: block;
      width: 42px;
      height: 42px;
      font-size: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;
      margin: 4px 4px;
    }
    svg {
      // font-size: 20px;
      color: #fff;
    }
  }
}
</style>
