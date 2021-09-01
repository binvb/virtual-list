<template>
  <Scroll :initDataNum="initDataNum" :ScrollItem="ScrollItem" :Tombstone="Tombstone" :sourceData="sourceData"/>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Scroll from './../../index.vue'
import ScrollItem from './scrollItem.vue'
import Tombstone from './tombstone.vue'
import { Message, getMessage} from './../mock'

export default defineComponent({
    components: {
      Scroll
    },
    props: {
        initDataNum: {
            type: Number,
            default: 20,
        },
    },
    setup(props) {
        let sourceData = ref<Message[]>([])

        sourceData.value = getMessage(2000)

        return {
          ...props,
          sourceData,
          ScrollItem,
          Tombstone
        }
    },
})
</script>
<style lang="less">
html {
  background-color: #eeeeee;
}

html, body {
  height: 100%;
  margin: 0;
  padding: 0;
  font-family: 'Roboto', sans-serif;
  overflow: hidden;
  -webkit-tap-highlight-color: rgba(0,0,0,0);
}
.chat-item {
  display: flex;
  padding: 10px 0;
  width: 100%;
  contain: layout;
  will-change: transform;
  p {
      margin: 0;
      word-wrap: break-word;
      font-size: 13px;
  }
}
.avatar {
  width: 48px;
  height: 48px;
  border-radius: 500px;
  margin-left: 20px;
  margin-right: 6px;
  min-width: 48px;
}
.bubble {
  padding: 7px 10px;
  color: #333;
  background: #fff;
  box-shadow: 0 3px 2px rgba(0,0,0,0.1);
  position: relative;
  max-width: 420px;
  min-width: 80px;
  margin: 0 5px;
}
.meta {
  font-size: 0.8rem;
  color: #999;
  margin-top: 3px;
}
</style>