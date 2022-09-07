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
</script>
<template>
    <div style="width: 800px;height: 1000px;margin: 0 auto;border: 1px solid #000">
        <VirtualList
        :initDataNum="20"
        :ScrollItemComponent="CommonItem"
        :retainHeightValue="100"
        :loadingOptions="loadingOptions"
        ref="virtualScroll"
      ></VirtualList>
    </div>
</template>