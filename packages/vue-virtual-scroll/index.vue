<template>
    <ul ref="scrollArea" class="scroll-wrap">
        <li class="chat-item" v-for="(item, index) in currentData" :key="index" :data-scrollId="index" :style="{position: 'absolute', transform: `translateY(${item.transformY || 0}px)`}">
            <component :is="ScrollItem" :itemData="item"></component>
        </li>
    </ul>
    <!-- 用于渲染进行高度计算，无需显示 -->
    <ul :class="templateClass" style="visibility: hidden;">
        <li class="chat-item" ref="itemTemplate">
            <component :is="ScrollItem" :itemData="countItemData"></component>
        </li>
    </ul>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, Component, PropType } from 'vue'
import { debounce, cloneDeep } from 'lodash'
import { getScrollHeight, getScrollItemIndex } from './scroll'

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
        },
        getData: {
            type: Object as PropType<(size: number) => {}>,
            required: true
        }
    },
    setup(props) {
        const scrollArea = ref<HTMLElement | null>(null)
        const itemTemplate = ref<HTMLElement | null>(null)
        const templateClass = ref<string>('invisible')
        const countItemData = ref<{}>({})
        const currentData = ref<any[]>([])
        const beforeScrollTop  = ref<number>(0)
        const scrollDirection = ref<'up' | 'down'>('down')

        async function getScrollItemHeight(source: any[]) {
            let _source = cloneDeep(source)
            let _length = _source.length
            let _distance = 0

            templateClass.value = ''
            for(let i = 0; i < _length; i++) {
                countItemData.value = _source[i]
                await new Promise((resolve, reject):void => {
                    setTimeout(() => {
                        resolve(true)
                    }, 0)
                })
                _source[i].transformY = _distance
                _distance += (itemTemplate.value?.offsetHeight || 0)
            }
            templateClass.value = 'invisible'

            return _source
        }

        getScrollItemHeight(props.dataSource)
        .then(data => {
            currentData.value = data
        })

        onMounted(() => {
            scrollArea.value?.addEventListener('scroll', debounce(() => {
                let _distance = 0
                let _currentScrollTop = getScrollHeight(<HTMLElement>scrollArea.value)
                let _currentIndex = 0
                let _beforeIndex = 0
                let _scrollItemNum = 0

                _distance = _currentScrollTop - beforeScrollTop.value
                if(_distance) {
                    scrollDirection.value = 'down'
                } else {
                    scrollDirection.value = 'up'
                }
                _currentIndex = getScrollItemIndex(currentData.value, scrollDirection.value, _currentScrollTop)
                _beforeIndex = getScrollItemIndex(currentData.value, scrollDirection.value, beforeScrollTop.value)
                _scrollItemNum = Math.abs(_currentIndex - _beforeIndex)
                if(scrollDirection.value === 'down') {
                    currentData.value.push(props.getData(_scrollItemNum))
                    currentData.value.splice(0, _scrollItemNum)
                } else {
                    currentData.value.splice(0, 0, props.getData(_scrollItemNum))
                    currentData.value.splice(currentData.value.length - _scrollItemNum, _scrollItemNum)
                }


                beforeScrollTop.value = _currentScrollTop
            }, 20))
        })

        return {
            countItemData,
            templateClass,
            itemTemplate,
            scrollArea,
            ...props,
            currentData,
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
.invisible {
    display: none;
}
</style>