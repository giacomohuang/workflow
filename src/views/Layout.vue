<template>
  <header class="header">{{ $route.meta.title }}</header>
  <div class="main-wrap">
    <div class="main-menu">
      <template v-for="(item, index) in menu_data" :key="index">
        <RouterLink custom :to="item.path" v-slot="{ isActive }">
          <div class="item" :class="{ active: index === currentMenuIndex, 'init-active': isActive && currentMenuIndex === -1 }" v-if="!item.hidden" @click.stop="changeSubNav($event, item, index)"><Icon :id="item.icon"></Icon>{{ item.meta.title }}</div>
        </RouterLink>
      </template>
    </div>
    <div class="sub-menu">
      <SubMenu :active_name="active_menu_name" :data="sub_menu_data"></SubMenu>
    </div>
    <div class="main">
      <el-scrollbar>
        <router-view />
      </el-scrollbar>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { router, dynamicRoutes } from '../router/router'
import Icon from '../components/Icon.vue'
import SubMenu from './SubMenu.vue'
import { RouterLink, RouterView } from 'vue-router'

const menu_data = ref([])
const sub_menu_data = ref([])
const active_menu_name = ref(router.currentRoute.name)
const currentMenuIndex = ref(-1)

menu_data.value = dynamicRoutes
// 取根节点下的子菜单
sub_menu_data.value = router.currentRoute.value.matched[0].children

function changeSubNav(ev, item, index) {
  // const dom = document.getElementsByClassName('menu-init-active')
  // if (dom && dom[0]) {
  //   console.log(dom[0].classList)
  //   dom[0].classList.remove('menu-init-active')
  // }
  if (item.children && item.children.length > 0) {
    // document.getElementsByClassName('')
    currentMenuIndex.value = index
    sub_menu_data.value = item.children
  } else {
    router.push({ path: item.path })
  }
}
// console.log(router.currentRoute.value)

onMounted(() => {})

// function getNav() {
//   for (let item of dynamicRoutes) {
//   }
// }
// function getSubNav() {}
</script>

<style scoped lang="scss">
.main-wrap {
  background: #f3f3f3;
  display: flex;
  flex-direction: row;
  height: calc(100vh - 64px);
}

.header {
  display: flex;
  flex-direction: row;
  position: relative;
  align-items: center;
  padding: 0 12px;
  width: 100%;
  height: 64px;
  font-size: 16px;
  background-color: rgb(255 255 255 / 0.7);
  border-bottom: 1px solid #e3e3e3;
  z-index: 101;
  backdrop-filter: blur(12px);

  box-shadow: 0px 4px 4px 0px rgba(210, 210, 210, 0.3);
}

.main-menu {
  z-index: 100;
  user-select: none;
  width: 90px;
  min-width: 90px;
  padding: 12px 0;
  background: #5e4e63;
  color: #fff;
  font-size: 12px;

  .active,
  .init-active {
    background: #fff;
    color: #333;
  }

  .item {
    display: flex;
    align-items: center;
    cursor: pointer;
    // background: #5a5a5a;
    transition: cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0.25s;
    &:hover:not(.active),
    &:active:not(.active) {
      background: #87a1ff44;
      color: #fff;
      transition: cubic-bezier(0.645, 0.045, 0.355, 1), background-color 0.25s;
    }

    &:before {
      content: ' ';
      display: block;
      width: 4px;
      height: 36px;
      margin-right: 8px;

      // transform: scaleY(0);
    }
    // &:hover::before,
    // .active:before {
    //   // height: 36px;
    //   transform: scaleY(1);
    //   transition: cubic-bezier(0.645, 0.045, 0.355, 1), transform 0.15s;
    //   background: #37f;
    // }
  }

  svg {
    margin-right: 4px;
  }
}
.router-link-active {
  background: #fff;
  color: #333;
}

.sub-menu {
  z-index: 100;
  // display: none;
  user-select: none;
  width: 150px;
  min-width: 150px;
  background: #fff;
  padding-top: 14px;
  font-size: 14px;
  box-shadow: 4px 0px 4px 0px rgba(210, 210, 210, 0.3);
  // border-right: 1px solid #e3e3e3;
}

.main {
  position: relative;
  overflow-y: hidden;
  flex-grow: 1;
  margin: 12px;
  background: #fff;
  border-radius: 8px;
  min-width: 800px;
  // display: flex;
  // padding: 12px;
}
</style>
