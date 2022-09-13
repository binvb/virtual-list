<script setup lang="ts">
import { onMounted, reactive } from 'vue'
import { useRoute } from 'vue-router'

interface User {
  name: string
  top: number
}
interface Data {
  list: User[]
}
const data = reactive<Data>({
  list: []
})
const route = useRoute()

onMounted(() => {
  getList(100)
})

function getList(num: number) {
  for(let i = 0; i < num; i += 1) {
    data.list.push(
      {
        name: `vb${i}`,
        top: 40 * i
      }
    )
  }
}
</script>
<template>
  <div class="header">
    <h1>vue3-virtual-list</h1>
    <a :class="{active: route.name === 'Normal'}" href="#/normal">normal</a>
    <a :class="{active: route.name === 'Loading'}" href="#/loading">loading</a>
    <a :class="{'active': route.name === 'Chat'}" href="#/chat">chat</a>
  </div>
  <router-view></router-view>
</template>

<style lang="less" scoped>
.header {
  display: flex;
  justify-content: flex-start;
  h1 {
    display: block;
    padding: 4px 10px;
    margin-left: 10px;
    background: #eee;
    font-size: 24px;
    border-radius: 4px;
  }
  a {
    display: block;
    height: 24px;
    padding: 2px 5px;
    margin: 20px 20px;
    background: #333;
    color: #fff;
    line-height: 24px;
    border-radius: 4px;
    cursor: pointer;
    text-decoration: none;
  }
  .active {
    background: #ca9252;
  }
}
</style>