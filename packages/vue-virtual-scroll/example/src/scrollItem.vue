<template>
    <div class="chat-item">
        <img class="avatar" :src="itemData?.avatar" />
        <div class="bubble">
            <p>{{itemData?.content}}</p>
            <div class="meta">
                <time class="posted-date">{{itemData?.time}}</time>
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
    },
})
</script>
