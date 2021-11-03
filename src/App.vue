<script setup lang="ts">
import { onMounted, nextTick, reactive, ref } from 'vue'
import ScrollList from './../index.vue'
import ScrollItem from './components/ScrollItem.vue'
import { getMessage } from './mock'

let sourceData = getMessage(200)

</script>
<template>
  <ScrollList :sourceData="sourceData" :initDataNum="20" :ScrollItemComponent="ScrollItem" :initItemHeight="93"></ScrollList>
</template>
<style lang="less" scoped>
.myTest {
  display: inline-block;
}
</style>