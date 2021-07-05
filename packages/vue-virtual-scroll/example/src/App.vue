<template>
    <VueVirtualScroll>
      <div>testtesttest</div>
    </VueVirtualScroll>
    <ScrollItem>
      <div>testtesttest</div>
    </ScrollItem>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue"
import VueVirtualScroll from './../../index.vue'
import ScrollItem from './components/scrollItem.vue'
import Tombstone from './components/tombstone.vue'
import getMock, {Params} from './mock'

export default defineComponent({
  name: 'App',
  components: {
    VueVirtualScroll,
    ScrollItem
  },
  setup: () => {
    let dataSource: Params[] = reactive([])

    getMock(1)
    .then((data) => {
      dataSource = data
    })
    return {
      dataSource,
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
