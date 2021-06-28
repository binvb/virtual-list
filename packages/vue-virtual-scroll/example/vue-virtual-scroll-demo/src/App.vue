<template>
  <div id="app">
    <VueVirtualScroll
    :scrollItem=ScrollItem
    :tombstoneItem=Tombstone
     />
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue"
import VueVirtualScroll from './../../../index.vue'
import ScrollItem from './component/scrollItem.vue'
import Tombstone from './component/tombstone.vue'

export default defineComponent({
  name: 'App',
  components: {
    VueVirtualScroll
  },
  setup: () => {
    return {
      ScrollItem,
      Tombstone
    }
  }
})
</script>

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
