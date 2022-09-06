<script setup lang="ts">
import { reactive, onMounted, ref } from 'vue'
import { VirtualExpose } from '@vb_he/vue-virtual-scroll'
import ScrollItem from './../components/normal.component.vue'
import { getMessage } from "./../mock"

const virtualScroll = ref<VirtualExpose>()

onMounted(async() => {
    virtualScroll.value!.setSourceData(await loadData())
})

function loadData(): Promise<any[]> {
    return new Promise((resolve) => {
    setTimeout(() => {
      resolve(getMessage(100))
    },1000)
  })
}
</script>
<template>
    <div style="width: 800px;height: 1000px;margin: 0 auto;border: 1px solid #000">
        <VirtualList
        :initDataNum="20"
        :ScrollItemComponent="ScrollItem"
        :retainHeightValue="100"
        ref="virtualScroll"
      ></VirtualList>
    </div>
</template>