<script setup lang='ts'>
import { ComponentPublicInstance, reactive, ref, onMounted, onUnmounted} from 'vue'
import { sleep, getOffsetHeight, getShowData, getScrollItemNum } from './utils'
import { SourceData, ItemProps, ReactiveData, Direction } from './index'
import addQueue from './queue'
import { debounce } from 'lodash'

interface Props {
  sourceData: SourceData[],
  ScrollItemComponent: ComponentPublicInstance,
  initDataNum: number,
  initItemHeight: number
}

const props = defineProps<Props>()
const data = reactive<ReactiveData>({
  sourceData: props.sourceData,
  currentData: [],
  templateData: {},
  currentScrollTop: 0
})
const itemTemplate = ref()

// init data
initData()

// hooks
onMounted(() => {
  let _scrollEl = document.querySelector('.scroll-wrapper')

  _scrollEl?.addEventListener('scroll', debounce(scrollHandler, 200))
})

// methods
function initData() {
  data.sourceData = data.sourceData.map((item, index) => {
    return {
      ...item,
      index: index,
      transformY: 0,
      offsetHeight: 0
    }
  })
  render(0, props.initDataNum * 2, 'init')
}
async function render(start = 0, itemNum:number = props.initDataNum * 2, direction: Direction = 'down') {
  let offsetHeight
  let index 

  for(let i = 0, len = itemNum; i < len; i++) {
    index = direction === 'up' ? start - i : start + i
    data.templateData = data.sourceData[index]
    await sleep()
    offsetHeight = getOffsetHeight(itemTemplate.value)

    getShowData(data.sourceData as ItemProps[], data.currentData, direction, index, offsetHeight, props.initDataNum)
  }
}
function scrollHandler() {
  let scrollTop = document.querySelector('.scroll-wrapper')?.scrollTop || 0
  let distance = scrollTop - data.currentScrollTop
  let direction: Direction = distance > 0 ? 'down' : 'up'
  let scrollItemNum = getScrollItemNum(data.currentData, distance, direction)

  if(scrollItemNum > 0) {
    addQueue(() => {
      render(direction === 'down' ? (data.currentData[data.currentData.length - 1].index + 1) : (data.currentData[0].index - 1), scrollItemNum, direction)
    })
  }
}
</script>
    
<template>
<ul ref="scrollArea" class="scroll-wrapper" data-testid="scroll-wrapper">
    <template v-for="item in data.currentData" :key="item.index">
      <li :data-scrollId="item.index" :data-offsetHeight="item.offsetHeight" :style="{position: 'absolute', transform: `translateY(${item.transformY || 0}px)`}">
          <component :is="props.ScrollItemComponent" :itemData="item" />
      </li>
    </template>
</ul>
<ul class="scroll-wrapper" style="visibility: hidden;position:absolute;transform: translateY(-1000px)">
    <li ref="itemTemplate">
        <component :is="props.ScrollItemComponent" :itemData="data.templateData" />
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