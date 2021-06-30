<template>
    <div class="chat-timeline">
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    name: 'vue-virtual-scroll',
    props: {
        scrollItem: { // scroll list item   
            type: HTMLElement,
            required: true
        },
    },
    setup: () => {
        return {
            
        }
    }
})
</script>
<style>
.chat-timeline {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow-y: scroll;
}
</style>