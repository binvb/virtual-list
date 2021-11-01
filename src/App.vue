<script setup lang="ts">
import ScrollList from './../index.vue'
import ScrollItem from './components/ScrollItem.vue'
import Hello from './components/Hello.vue'
import { getMessage } from './mock'

let sourceData = getMessage(2000)
</script>
<template>
  <ScrollList :sourceData="sourceData" :initDataNum="20" :ScrollItemComponent="ScrollItem"></ScrollList>
</template>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
