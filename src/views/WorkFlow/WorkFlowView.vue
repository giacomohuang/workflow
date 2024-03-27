<template>
  <div class="main">
    <div class="bg">
      <div class="scrollbar">
        <div id="dragger">
          <div id="canvas">
            <div id="scaler">
              <div id="root">
                <div id="nodes">
                  <WorkFlowNode :item="workflow_data" :flag="true"></WorkFlowNode>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>

  <el-drawer class="node-edit" v-model="drawer" :show-close="false" direction="rtl" modal append-to-body>
    <template #header="{ close }">
      <div class="title">{{ editing_node.title }}<Icon id="#icon-edit"></Icon></div>
      <div class="close" @click="close"><Icon id="#icon-remove"></Icon></div>
    </template>
    {{ editing_node }}
  </el-drawer>

  <div id="zoom">
    <div class="item" @click.stop="zoom('out')"><Icon id="#icon-zoom-out"></Icon></div>
    <div class="item" style="width: 58px; text-align: center" @click.stop="zoom('reset')">{{ zoom_percent }}%</div>
    <div class="item" @click.stop="zoom('in')"><Icon id="#icon-zoom-in"></Icon></div>
    <div class="item" @click.stop="center"><Icon id="#icon-center"></Icon></div>
  </div>
</template>

<script setup>
import { provide, onMounted, ref, nextTick } from 'vue'
import Drag from '../../base/move'
import { workflowAPI } from '../../api/workflow'
import Icon from '../../components/Icon.vue'
import WorkFlowNode from './WorkFlowNode.vue'

// "+"按钮对应的节点ID
const active_nodeid = ref('')
// 当前编辑节点
const editing_node = ref('')
// 侧边栏打开状态
const drawer = ref(false)
// 画布缩放倍率
const zoom_percent = ref(100)
// 审批流程主数据
const workflow_data = ref({})
provide('active_nodeid', active_nodeid)
provide('editing_node', editing_node)
provide('drawer', drawer)
provide('workflow_data', workflow_data)

// 数据初始化
async function initData() {
  let t = await workflowAPI.get(1).then((res) => {
    return res
  })
  workflow_data.value = t
  nextTick(() => {
    center()
  })
}

// 重新计算画布大小，并居中
function center() {
  let dragger = document.getElementById('dragger')
  let canvas = document.getElementById('canvas')
  let nodes = document.getElementById('nodes')
  canvas.style.width = Math.max(nodes.offsetWidth, document.body.clientWidth) * 2 + 'px'
  canvas.style.height = nodes.offsetHeight * 2 + 'px'
  canvas.style.paddingLeft = (canvas.offsetWidth - nodes.offsetWidth) / 2 + 'px'
  canvas.style.paddingTop = (canvas.offsetHeight - nodes.offsetHeight) / 2 + 'px'
  dragger.scrollLeft = (canvas.offsetWidth - dragger.clientWidth) / 2
  dragger.scrollTop = (canvas.offsetHeight - nodes.offsetHeight) / 2 - 100
}

// 缩放画布
function zoom(mode) {
  switch (mode) {
    case 'out':
      if (zoom_percent.value >= 50) {
        zoom_percent.value -= 25
      }
      break
    case 'in':
      if (zoom_percent.value < 300) {
        zoom_percent.value += 25
      }
      break
    case 'reset':
      zoom_percent.value = 100
  }
  document.getElementById('scaler').style.transform = `scale(${zoom_percent.value / 100})`
  document.getElementById('node-panel').style.transform = `scale(${100 / zoom_percent.value})`
}

onMounted(() => {
  initData()
  new Drag(document.getElementById('dragger'))
})
</script>

<style scoped lang="scss">
.main {
  position: relative;
  overflow: auto;
  height: calc(100vh - 64px);
}

.header {
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  height: 64px;
  background: #fff;
  border-bottom: 1px solid #e3e3e3;
}

.bg {
  position: fixed;
  left: 0;
  top: 64px;
  right: 0;
  bottom: 0;
  z-index: 11;
  background: #f0f0f2;
}

.scrollbar {
  position: relative;
  height: 100%;
  overflow: hidden !important;
  overflow-anchor: none;
  touch-action: auto;
}

#dragger {
  cursor: grab;
  height: 100%;
  position: relative;
  overflow: scroll;
}

#scaler {
  transform: scale(1);
  transform-origin: center top;
  flex-shrink: 0;
  flex-grow: 0;
  height: fit-content;
  width: fit-content;
  user-select: none;
  display: block;
  margin: 0;
  padding: 0;
}

#root {
  margin: 0 auto;
  padding: 0;
  position: relative;
  display: inline-flex;
  flex-direction: column;
  align-items: center;
  min-height: 100%;
}

#nodes {
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.settings {
  min-width: 300px;
  padding-top: 40px;
  background: #fff;
  overflow-y: auto;
  border-left: 1px solid #e3e3e3;
}

.node-edit {
  .title {
    font-size: 16px;
    color: #000;
  }
  .close {
    font-size: 16px;
    border-radius: 50%;
    padding: 8px;
    cursor: pointer;
    &:hover {
      background: #f1f1f1;
      color: #000;
    }
  }
}

#zoom {
  position: fixed;
  display: flex;
  flex-direction: row;
  left: 100px;
  bottom: 50px;
  background: #fff;
  z-index: 100;
  padding: 8px;
  border-radius: 12px;
  box-shadow: 2px 2px 4px 0 rgba(170, 170, 170, 0.3);
  .item {
    user-select: none;
    border-radius: 8px;
    padding: 8px;
    line-height: 20px;
    cursor: pointer;
    &:hover {
      background: #eee;
    }
  }
  svg {
    font-size: 20px;
  }
}
</style>
