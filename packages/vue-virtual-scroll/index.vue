<template>
    <ul ref="scrollArea" class="scroll-wrap">
        <li class="chat-item" v-for="item in currentData" :key="item.index" :data-scrollId="item.index" :style="{position: 'absolute', transform: `translateY(${item.transformY || 0}px)`}">
            <component v-if="item.isTombstone" :is="Tombstone" :itemData="item" :key="item.index"></component>
            <component v-else :is="ScrollItem" :itemData="item" :key="item.index"></component>
        </li>
    </ul>
    <!-- 用于渲染进行高度计算，无需显示 -->
    <ul style="visibility: hidden;position:absolute;transform: translateY(10000px)">
        <li class="chat-item" ref="itemTemplate">
            <component :is="ScrollItem" :itemData="templateData"></component>
        </li>
        <li class="chat-item" ref="tombstoneTemplate">
            <component :is="Tombstone"></component>
        </li>
    </ul>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, Component, PropType } from 'vue'
import { debounce, cloneDeep, isEmpty } from 'lodash'
import { getScrollHeight, getScrollItemIndex } from './scroll'
import * as utils from './utils'

export default defineComponent({
    inheritAttrs: false,
    props: {
        timing: {
            type: Number,
            default: 20,
        },
        ScrollItem: {
            type: Object as PropType<Component>,
            required: true
        },
        Tombstone: {
            type: Object as PropType<Component>,
            required: true
        },
        dataSource: {
            type: Object as PropType<any[]>,
            required: true
        },
        getData: {
            type: Function as PropType<(size: number) => any[]>,
            required: true
        }
    },
    setup(props) {
        const scrollArea = ref<HTMLElement | null>(null)
        const itemTemplate = ref<HTMLElement | null>(null)
        const tombstoneTemplate = ref<HTMLElement | null>(null)
        const templateClass = ref<string>('invisible')
        const templateData = ref<{}>({})
        const currentData = ref<any[]>([])
        const beforeScrollTop  = ref<number>(0)
        const scrollDirection = ref<'up' | 'down'>('down')

        getScrollItemHeight(props.dataSource)
        .then(data => {
            currentData.value = data
        })

        async function getScrollItemHeight(source: any[], originData: any={}, direction: string='down', type:('scrollitem' | 'tombstone')='scrollitem') {
            let _source = cloneDeep(source)
            let _length = _source.length
            let originIndex = 0
            let originDistance = 0

            for(let i = 0; i < _length; i++) {
                if(type === 'scrollitem') {
                    templateData.value = i === 0 ? originData : _source[i - 1]
                    await new Promise((resolve, reject):void => {
                        setTimeout(() => {
                            resolve(true)
                        }, 0)
                    })
                }
                if(!isEmpty(originData) && i === 0) {
                    originDistance = originData.transformY
                }
                if(direction === 'down') {
                    originIndex = ((originData.index || -1) + 1) + i
                    originDistance += (_source[i].offsetHeight || itemTemplate.value?.offsetHeight || 0)
                } else {
                    originIndex = ((originData.index || 0) - 1) - i  
                    originDistance -= (itemTemplate.value?.offsetHeight || 0)
                }
                if(originIndex === 0) {
                    originDistance = 0
                }
                _source[i].index = originIndex
                _source[i].transformY = originDistance
            }

            return _source
        }
        onMounted(() => {
            scrollArea.value?.addEventListener('scroll', debounce(() => {
                let _distance = 0
                let _currentScrollTop = getScrollHeight(<HTMLElement>scrollArea.value)
                let _currentIndex = 0
                let _beforeIndex = 0
                let _scrollItemNum = 0
                let _newData: any[] = []
                let tombstoneOffsetHeight = tombstoneTemplate.value?.offsetHeight

                _distance = _currentScrollTop - beforeScrollTop.value
                if(_distance) {
                    scrollDirection.value = 'down'
                } else {
                    scrollDirection.value = 'up'
                }
                _currentIndex = getScrollItemIndex(currentData.value, scrollDirection.value, _currentScrollTop)
                _beforeIndex = getScrollItemIndex(currentData.value, scrollDirection.value, beforeScrollTop.value)
                _scrollItemNum = Math.abs(_currentIndex - _beforeIndex)
                if(!_scrollItemNum) {
                    return 
                }
                if(scrollDirection.value === 'down') {
                    _newData = props.getData(_scrollItemNum)
                    getScrollItemHeight(utils.addTombStoneProperty(_newData, tombstoneOffsetHeight))
                    .then(data => {
                        currentData.value = [...currentData.value, ...data]
                        currentData.value.splice(0, _scrollItemNum)
                    })
                    .then(() => {
                        getScrollItemHeight(_newData, currentData.value[currentData.value.length - 1])
                        .then(data => {
                            currentData.value = [...currentData.value, ...data]
                            currentData.value.splice(0, _scrollItemNum)
                        })
                    })
                } else {
                    getScrollItemHeight(_newData, currentData.value[0])
                    .then(data => {
                        currentData.value.splice(0, 0, data)
                        currentData.value.splice(currentData.value.length - _scrollItemNum, _scrollItemNum)
                    })
                }
                beforeScrollTop.value = _currentScrollTop
            }, 30))
        })

        return {
            tombstoneTemplate,
            templateData,
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