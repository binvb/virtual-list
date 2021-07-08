<template>
    <ul ref="scrollArea" class="scroll-wrap">
        <component :is="ScrollItem" :dataSource="dataSource"></component>
    </ul>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, Component, PropType } from 'vue'
import { debounce } from 'lodash'
import { getScrollHeight } from './scroll'

export default defineComponent({
    props: {
        timing: {
            type: Number,
            default: 20,
        },
        ScrollItem: {
            type: Object as PropType<Component>,
            required: true
        },
        dataSource: {
            type: Object as PropType<any[]>,
            required: true
        }
    },
    setup(props) {
        const scrollArea = ref<HTMLElement | null>(null)
        
        onMounted(() => {
            scrollArea.value?.addEventListener('scroll', debounce(() => {
                getScrollHeight(<HTMLElement>scrollArea.value)
            }, 20))
        })

        return {
            scrollArea,
            ...props
        }
    },
})
</script>
<style lang="less" scoped>
.scroll-wrap {
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  height: 100%;
  position: absolute;
  box-sizing: border-box;
  contain: layout;
  will-change: transform;
}
</style>