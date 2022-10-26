<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { VirtualExpose } from '@vb_he/vue-virtual-scroll'
import CommonItem from './../components/common.component.vue'
import { getMessage } from "./../mock"

const virtualScroll = ref<VirtualExpose>()
const loadingOptions = reactive({
  loadingFn: loadData,
  direction: 'down'
})
const data = reactive({
    locateNum: 0,
    updateNum: 0,
    delNum: 0,
    addNum: 0,
    size: 100
})

onMounted(async() => {
    virtualScroll.value?.setSourceData(await getMessage(100))
})

function loadData() {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMessage(100))
    },3000)
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
          <input v-model="data.delNum" type="number" placeholder="index" />
          <button @click="del">del</button>
        </div>
        <div style="display:flex;justify-content: space-between;margin-top: 20px">
          <input v-model="data.addNum" type="number" placeholder="index" />
          <button @click="add">add</button>
        </div>
      </div>
      <div style="width: 800px;height: 1000px;margin: 0 auto;border: 1px solid #000">
          <VirtualList
          ref="virtualScroll"
          :perPageItemNum="20"
          :scrollItem="CommonItem"
          :height="100"
          :loadingOptions="loadingOptions"
        ></VirtualList>
      </div>
    </div>
</template>