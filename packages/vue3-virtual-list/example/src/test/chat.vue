<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import VirtualList from './../../../src/index.vue'
import ChatItem from './../components/chat.component.vue'
import { getMessage } from "./../mock"

const virtualScroll = ref()
const loadingOptions = reactive({
    loadingFn: loadData,
    nomoreData: false
})
const content = ref('')

onMounted(async() => {
    virtualScroll.value!.setSourceData(await getMessage(100))
})

// methods
function loadData():Promise<any[]> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(getMessage(100))
        },1000)
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
    <div style="display: flex;">
        <div style="width: 800px;height: 1000px;margin: 0 auto;">
            <div style="width: 800px;height: 1000px;border: 1px solid #000">
                <Virtual-list
                ref="virtualScroll"
                :initDataNum="20"
                :ScrollItemComponent="ChatItem"
                :retainHeightValue="100"
                :loadingOptions="loadingOptions"
                direction="up"
                ></Virtual-list>
            </div>
            <div style="display:flex;width: 800px;margin: 0 auto;">
                <textarea v-model="content" style="flex: 1 1 auto" data-testid="sendContent"></textarea>
                <button @click="send" data-testid="sendBtn">send</button>
            </div>
        </div>
    </div>
</template>