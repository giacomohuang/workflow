<template>
  <ul>
    <li class="sub-menu-item" v-for="(item, index) in props.data" :key="index">
      <RouterLink custom :to="item.path" v-slot="{ isActive }">
        <ul v-if="item.children">
          <div @click.stop="toggle_children" class="text parent">
            <div :class="{ 'router-link-active': isActive }">{{ item.meta.title }}</div>

            <Icon class="arrow" id="#icon-arrow-up"></Icon>
          </div>
          <SubMenu class="children" :class="{ 'init-s-active': isActive }" :data="item.children" :default-active="props.active_name"></SubMenu>
        </ul>

        <RouterLink class="parent text" v-else :to="item.path">{{ item.meta.title }}</RouterLink>
      </RouterLink>
    </li>
  </ul>
</template>

<script setup>
import Icon from '../components/Icon.vue'
import { onMounted } from 'vue'
const props = defineProps(['data', 'active_name'])

function toggle_children(ev) {
  console.log(ev.currentTarget.nextElementSibling.style)

  const dom = ev.currentTarget.nextElementSibling
  if (dom.style.display === '') {
    dom.style.display = 'block'
    ev.currentTarget.classList.add('expand')
  } else {
    dom.style.display = ''
    ev.currentTarget.classList.remove('expand')
  }
}

onMounted(() => {
  //默认展开当前路由的子菜单
  const dom = document.getElementsByClassName('init-s-active')
  if (dom && dom[0]) {
    dom[0].style.display = 'block'
    // dom[0].classList.add('expand')
    dom[0].previousElementSibling.classList.add('expand')
  }
})
</script>

<style scoped lang="scss">
ul {
  line-height: 1.5;
  list-style: none;
  padding: 0;
  margin: 0;
  display: block;
  clear: both;
}

li {
  cursor: pointer;
}

a:link,
a:visited {
  color: #333;
  text-decoration: none;
}

.text {
  display: flex;
  align-items: center;
  padding: 4px 16px;
  // color: #333;
  justify-content: space-between;

  &:hover,
  &:active {
    background: #b6b6b644;
  }
}
.children {
  display: none;
}

.arrow {
  transition: cubic-bezier(0.645, 0.045, 0.355, 1), transform 0.15s;
}
.expand .arrow {
  transform: rotate(180deg);
  transition: cubic-bezier(0.645, 0.045, 0.355, 1), transform 0.15s;
}

.parent .router-link-active {
  color: #000;
}
.parent.router-link-active {
  color: var(--el-color-primary);
}

.parent.router-exact-link-active {
  color: var(--el-color-primary);
}

.children .router-link-active {
  color: #333;
}

// .router-link-active {
//   font-weight: 800;
// }
.children .router-link-exact-active {
  color: var(--el-color-primary);
}

.children .text {
  padding-left: 28px;
}
</style>
