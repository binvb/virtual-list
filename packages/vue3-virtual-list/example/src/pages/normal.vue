<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { VirtualExpose } from '@vb_he/vue-virtual-scroll'
import CommonItem from './../components/common.component.vue'
import { getMessage } from "./../mock"

const virtualScroll = ref<VirtualExpose>()
const data = reactive({
  locateNum: 0,
  updateNum: 0,
  delNum: 0,
  addNum: 0,
  size: 100000
})

onMounted(async() => {
    virtualScroll.value!.setSourceData(await loadData())
})

function loadData(): Promise<any[]> {
    return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMessage(data.size))
    },1000)
  })
}
function locate() {
  virtualScroll.value?.locate(data.locateNum)
}
async function update() {
  const newData = await getMessage(1)

  virtualScroll.value?.update(data.updateNum, newData[0])
}
function del() {
  virtualScroll.value?.del(data.delNum)
}
async function add() {
  const newData = await getMessage(1)

  virtualScroll.value?.add(data.addNum, newData)
}
async function reset() {
  virtualScroll.value!.setSourceData(await loadData())
}
</script>
<template>
  <div style="display: flex;">
    <div style="display:flex;flex-direction: column;flex: 0 0 250px;margin-left: 10px">
      <div style="display:flex;justify-content: space-between;margin-top: 20px">
        <input v-model="data.locateNum" type="number" placeholder="index" />
        <button @click="locate">locate</button>
      </div>
      <div style="display:flex;justify-content: space-between;margin-top: 20px">
        <input v-model="data.updateNum" type="number" placeholder="index" />
        <button @click="update">update</button>
      </div>
      <div style="display:flex;justify-content: space-between;margin-top: 20px">
        <input v-model="data.updateNum" type="number" placeholder="index" />
        <button @click="del">del</button>
      </div>
      <div style="display:flex;justify-content: space-between;margin-top: 20px">
        <input v-model="data.addNum" type="number" placeholder="index" />
        <button @click="add">add</button>
      </div>
      <div style="display:flex;justify-content: space-between;margin-top: 20px">
        <input v-model="data.size" type="number" placeholder="index" />
        <button @click="reset">reset</button>
      </div>
    </div>
    <div style="width: 800px;height: 1000px;margin: 0 auto;border: 1px solid #000">
        <VirtualList
        :initDataNum="20"
        :ScrollItemComponent="CommonItem"
        :retainHeightValue="100"
        ref="virtualScroll"
      ></VirtualList>
    </div>
  </div>
</template>