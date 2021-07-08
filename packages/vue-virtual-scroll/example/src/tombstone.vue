<template>
<li class="chat-item tombstone" v-for="(item, index) in dataSource" :key="index" :data-id="index">
      <img class="avatar" width="48" height="48" src="images/unknown.jpg">
      <div class="bubble">
        <p></p>
        <p></p>
        <p></p>
        <div class="meta">
          <time class="posted-date"></time>
        </div>
      </div>
</li>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Message } from './../mock'

export default defineComponent({
    props: {
        dataSource: Object as PropType<Message[]>
    },
    setup() {
        
    },
})
</script>
