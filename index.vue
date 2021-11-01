<script setup lang='ts'>
import { defineProps, ComponentPublicInstance} from 'vue'
interface SouceData {
  [key: string]: any
}
interface Props {
  sourceData: SouceData[],
  ScrollItemComponent: ComponentPublicInstance,
  initDataNum: number
}
interface ItemProps {
  [key: string]: any,
  index: number,
  transformY: number,
  isVisible: boolean
}
const props = defineProps<Props>()
const currentData: ItemProps[] = props.sourceData.map((element, index) => {
    return {...element, index: index, transformY: 0, isVisible: index < (props.initDataNum - 1) ? true : false}
})
</script>
    
<template>
<ul ref="scrollArea" class="scroll-wrapper" data-testid="scroll-wrapper">
    <li v-for="item in currentData" :key="item.index" :data-scrollId="item.index" :style="{position: 'absolute', transform: `translateY(${item.transformY || 0}px)`}">
        <component  :is="props.ScrollItemComponent" v-if="item.isVisible" :itemData="item" />
    </li>
</ul>
</template>
<style lang='less' scoped>
.scroll-wrapper {
  position: absolute;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  height: 100%;
}
.scroll-wrapper li {
    transition: transform .2s ease-in-out;
}
.invisible {
    display: none;
}
</style>