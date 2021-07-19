<template>
    <div class="chat-item">
        <img class="avatar" width="48" height="48" src="images/unknown.jpg">
        <div class="bubble">
        <p></p>
        <div class="meta">
            <time class="posted-date"></time>
        </div>
        </div>
    </div>
</template>
<script lang="ts">
import { defineComponent, PropType } from 'vue'
import { Message } from './../mock'

export default defineComponent({
    props: {
        itemData: Object as PropType<Message>
    },
    setup() {  
    }
})
</script>
