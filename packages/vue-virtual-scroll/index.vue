<template>
    <div></div>
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
        tombstoneItem: { // tombStone item which equal lazyload
            type: HTMLElement,
            required: true
        },
        RUNWAY_ITEMS: { // Number of items to instantiate beyond current view in the scroll direction.
            type: Number,
            required: false
        },
        RUNWAY_ITEMS_OPPOSITE: {// Number of items to instantiate beyond current view in the opposite direction.
            type: Number,
            required: false
        }
    },
    setup: () => {
        return {
            
        }
    }
})
</script>