<template>
    <div class="chat-item">
        <img class="avatar" width="48" height="48" src="images/unknown.jpg">
        <div class="bubble">
        <p></p>
        <p></p>
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
<style lang="less" scoped>
.chat-item {
    p {
        width: 100%;
        height: 10px;
        margin: 6px 0;
        background: #999;
    }
    p:nth-child(2) {
        width: 60%;
    }
}
</style>
