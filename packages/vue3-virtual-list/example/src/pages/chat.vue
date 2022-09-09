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

onMounted(async() => {
    virtualScroll.value?.setSourceData(await getMessage(100))
})

function loadData() {
    return new Promise((resolve) => {
    setTimeout(() => {
        resolve(getMessage(100))
    },2000)
    })
}
async function send() {
    const list = virtualScroll.value?.getData()
    const newMsg = await getMessage(1)

    newMsg[0].content = content.value
    virtualScroll.value?.add(list!.length + 1, newMsg)
    content.value = ''
}
</script>
<template>
    <div style="width: 800px;height: 1000px;margin: 0 auto;border: 1px solid #000">
        <VirtualList
        :initDataNum="20"
        :ScrollItemComponent="ChatItem"
        :retainHeightValue="100"
        :loadingOptions="loadingOptions"
        direction="up"
        ref="virtualScroll"
        ></VirtualList>
    </div>
    <div style="display:flex;width: 800px;margin: 0 auto;">
        <textarea v-model="content" style="flex: 1 1 auto"></textarea>
        <button @click="send">send</button>
    </div>
</template>