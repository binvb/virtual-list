<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { VirtualExpose } from '@vb_he/vue-virtual-scroll'
import ChatItem from './../components/chat.component.vue'
import { getMessage } from "./../mock"

const virtualScroll = ref<VirtualExpose>()
const loadingOptions = reactive({
    loadingFn: loadData,
    nomoreData: false
})
const content = ref('')
const data = reactive({
    locateNum: 0,
    updateNum: 0,
    delNum: 0,
    addNum: 0,
    resetNum: 0,
    size: 20
})
let count = 0

onMounted(async() => {
    virtualScroll.value?.setSourceData(await loadData())
})

// methods
function loadData():Promise<any[]> {
    return new Promise((resolve) => {
        count++
        setTimeout(() => {
            resolve(getMessage(data.size))
            if(count >= 5) {
                loadingOptions.nomoreData = true
            }
        },2000)
    })
}
async function send() {
    const list = virtualScroll.value?.getData()
    const newMsg = await getMessage(1)

    newMsg[0].content = content.value
    virtualScroll.value?.add(list!.length, newMsg)
    content.value = ''
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
    virtualScroll.value?.setSourceData(await getMessage(data.resetNum))
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
          <div style="display:flex;justify-content: space-between;margin-top: 20px">
            <input v-model="data.resetNum" type="number" placeholder="index" />
            <button @click="reset">reset</button>
          </div>
        </div>
        <div style="margin: 0 auto;">
            <div style="width: 800px;height: 600px;border: 1px solid #000">
                <VirtualList
                ref="virtualScroll"
                :perPageItemNum="20"
                :scrollItem="ChatItem"
                :height="100"
                :loadingOptions="loadingOptions"
                direction="up"
                ></VirtualList>
            </div>
            <div style="display:flex;width: 800px;margin: 0 auto;">
                <textarea v-model="content" style="flex: 1 1 auto"></textarea>
                <button @click="send">send</button>
            </div>
        </div>
    </div>
</template>