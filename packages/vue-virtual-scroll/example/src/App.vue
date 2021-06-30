<template>
  <div id="app">
    <VueVirtualScroll
    :scrollItem=ScrollItem
    :tombstoneItem=Tombstone
     >
     </VueVirtualScroll>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref, reactive } from "vue"
import VueVirtualScroll from './../../index.vue'
import ScrollItem from './components/scrollItem.vue'
import Tombstone from './components/tombstone.vue'
import getMock, {Params} from './mock'

export default defineComponent({
  name: 'App',
  components: {
    VueVirtualScroll
  },
  setup: () => {
    const dataSource: Params[] = reactive([])
    
    getMock(1)
    .then(data => {
      dataSource.values = data
    })
    return {
      ScrollItem,
      Tombstone
    }
  }
})
</script>

<style>
body {
  margin: 0;
}
#app {
  width: 100%;
}
</style>
