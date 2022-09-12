<script setup lang="ts">
import { onMounted, reactive } from 'vue'
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
function add() {
  data.list.push({name: '操你', top: data.list.length * 40})
}
</script>
<template>
  <div class="header">
    <h1>vue3-virtual-list</h1>
    <a href="#/normal">normal</a>
    <a href="#/loading">loading</a>
    <a href="#/chat">chat</a>
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
}
</style>