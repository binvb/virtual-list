<template>
<div class="chat-item" v-for="(item, index) in dataSource" :key="index">
    <img class="avatar" :src="item.avatar" />
    <div class="bubble">
        <p>{{item.content}}</p>
        <div class="meta">
        <time class="posted-date">{{item.time}}</time>
        </div>
    </div>
</div>
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
