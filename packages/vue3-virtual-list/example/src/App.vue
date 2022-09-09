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
  <!-- <router-view></router-view> -->
  <button @click="add">增加元素</button>
  <ul style="position:relative;height: 200px; overflow-y: scroll; border: 1px solid #000;padding:0;">
    <li :style="{top: `${item.top}px`}" v-for="item in data.list">{{item.name}}</li>
    <div style="height: 1px;background:#000;overflow-anchor:auto;"></div>
  </ul>
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
.test {
  height: 200px;
  width: 100px;
  overflow-y:scroll;
  border: 1px solid #000;
  div {
    min-height: 30px;
    line-height: 30px;
    font-size: 24px;
    text-align: center;
  }
}
li {
  display: block;
  position: absolute;
  left: 0;
  height: 40px;
  width: 100%;
  line-height: 40px;
  list-style: none;
  border: 1px solid #eee;
  overflow-anchor:none;
}
</style>