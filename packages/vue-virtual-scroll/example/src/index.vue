<template>
    <div>
        <p>测试测试</p>
        <slot></slot>
    </div>
</template>
<script lang="ts">
import { defineComponent } from "vue"

export default defineComponent({
    name: 'vue-virtual-scroll',
    setup: (context, props) => {
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