<script setup lang='ts'>
import { ComponentPublicInstance, reactive, ref, onMounted} from 'vue'
import { sleep, getOffsetHeight } from './utils'

interface SouceData {
  [key: string]: any
}
interface Props {
  sourceData: SouceData[],
  ScrollItemComponent: ComponentPublicInstance,
  initDataNum: number,
  initItemHeight: number
}
interface ItemProps extends SouceData{
  index: number,
  transformY: number,
  offsetHeight: number,
  isVisible: boolean
}
interface ReactiveData {
  currentData: ItemProps[],
  templateData: Partial<ItemProps>
}
const props = defineProps<Props>()
const data = reactive<ReactiveData>({
  currentData: [],
  templateData: {}
})
let currentData: ItemProps[] = []
let templateData = reactive<Partial<ItemProps>>({})
const itemTemplate = ref('name')


currentData = props.sourceData.map((item, index) => {
  return {
    ...item, 
    index: index,
    transformY: 0,
    offsetHeight: 0,
    isVisible: true
  }
})
onMounted(() => {
  // currentData[0] = {
  //         ...props.sourceData[0], 
  //     index: 0,
  //     transformY: 0,
  //     offsetHeight: 0,
  //     isVisible: true
  // }
  // props.sourceData.forEach((item, index) => {
  //   currentData.push({
  //     ...item, 
  //     index: index,
  //     transformY: 0,
  //     offsetHeight: 0,
  //     isVisible: true
  //   })
  // })
  currentData = props.sourceData.map((item, index) => {
    return {
      ...item, 
      index: index,
      transformY: 0,
      offsetHeight: 0,
      isVisible: true
    }
  })
})

async function render(start = 0, end:number = props.initDataNum*3) {
  let _elHeight
  let _transformY
  let _tempArr:ItemProps[] = []

  for(let i = 0, len = end - start; i < len; i++) {
    templateData = currentData[i]
    await sleep()
    _elHeight = getOffsetHeight(itemTemplate.value)
    _transformY = i > 0 ? _tempArr[i - 1].transformY + _tempArr[i - 1].offsetHeight : 0
    _tempArr.push({
      ...currentData[i],
      transformY: _transformY,
      offsetHeight: _elHeight,
      isVisible: true
    })
  }
  currentData.splice(start, end - start, ..._tempArr)
  console.log(currentData)
}
</script>
    
<template>
<ul ref="scrollArea" class="scroll-wrapper" data-testid="scroll-wrapper">
    <template v-for="item in currentData" :key="item.index">
      <li v-if="item.isVisible" :data-scrollId="item.index" :style="{position: 'absolute', transform: `translateY(${item.transformY || 0}px)`}">
          <component :is="props.ScrollItemComponent" v-if="item.isVisible" :itemData="item" />
      </li>
    </template>
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