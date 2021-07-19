<template>
    <ul ref="scrollArea" class="scroll-wrap">
        <li v-for="item in currentData" :key="item.index" :data-scrollId="item.index" :style="{position: 'absolute', transform: `translateY(${item.transformY || 0}px)`}">
            <component v-if="item.isTombstone" :is="Tombstone" :itemData="item" :key="item.index"></component>
            <component v-else :is="ScrollItem" :itemData="item" :key="item.index"></component>
        </li>
    </ul>
    <!-- 用于渲染进行高度计算，无需显示 -->
    <ul style="visibility: hidden;position:absolute;transform: translateY(100px)">
        <li ref="itemTemplate">
            <component :is="ScrollItem" :itemData="templateData"></component>
        </li>
        <li ref="tombstoneTemplate">
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
        const tombstoneOffsetHeight = ref<number>(0)
        const templateClass = ref<string>('invisible')
        const templateData = ref<{}>({})
        const currentData = ref<any[]>([])
        const beforeScrollTop  = ref<number>(0)
        const scrollDirection = ref<'up' | 'down'>('down')

        function getTomstoneItem(source: any[], originData: any={}, direction: string='down') {
            let _source = cloneDeep(source)
            let _length = _source.length
            let originIndex = 0
            let originDistance = 0

            for(let i = 0; i < _length; i++) {
                if(!isEmpty(originData) && i === 0) {
                    originDistance = originData.transformY
                }
                originIndex = ((originData.index || -1) + 1) + i
                originDistance += tombstoneOffsetHeight.value
                if(originIndex === 0) {
                    originDistance = 0
                }
                _source[i].index = originIndex
                _source[i].transformY = originDistance
                _source[i].isTombstone = true
            }

            return _source
        }
        async function render(renderSource: any[]): Promise<any[]> {
            let _originData = cloneDeep(renderSource)
            let _originDataLength = _originData.length

            currentData.value = renderSource
            for(let i = 0; i < _originDataLength; i++) {
                if(_originData[i].isTombstone) {
                    templateData.value = _originData[i]
                    await utils.sleep(0)
                    _originData[i].isTombstone = false
                    _originData[i].offsetHeight = itemTemplate.value?.offsetHeight
                    if(i === 0) {
                        _originData[i].transformY = 0
                    } else {
                        _originData[i].transformY = _originData[i-1].offsetHeight + _originData[i - 1].transformY
                    }
                } else {
                    break
                }
            }

            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(_originData)
                }, 200)
            })
        }
        onMounted(async () => {
            tombstoneOffsetHeight.value = <number>tombstoneTemplate.value?.offsetHeight
            // init data
            currentData.value = await render(getTomstoneItem(props.dataSource))
            scrollArea.value?.addEventListener('scroll', debounce( async() => {
                let _distance = 0
                let _currentScrollTop = getScrollHeight(<HTMLElement>scrollArea.value)
                let _currentIndex = 0
                let _beforeIndex = 0
                let _scrollItemNum = 0
                let _newData: any[] = []

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
                    await render(getTomstoneItem(props.dataSource))
                    currentData.value.push(getTomstoneItem(props.getData(_scrollItemNum)))
                    // getTomstoneItem(_newData, currentData.value[currentData.value.length - 1], 'down')
                    // .then(data => {
                    //     currentData.value.splice(0, _scrollItemNum)
                    //     currentData.value = [...currentData.value, ...data]
                    // })
                    // .then(() => {
                    //     setTimeout(() => {
                    //         currentData.value.splice(currentData.value.length - _scrollItemNum, currentData.value.length)
                    //         getScrollItemHeight(_newData, currentData.value[currentData.value.length - 1], 'down', 'scrollitem')
                    //         .then(_itemData => {
                    //             currentData.value = [...currentData.value, ..._itemData]
                    //         })
                    //     }, 1000)
                    // })
                } else {
                    // getScrollItemHeight(_newData, currentData.value[0])
                    // .then(data => {
                    //     currentData.value.splice(0, 0, data)
                    //     currentData.value.splice(currentData.value.length - _scrollItemNum, _scrollItemNum)
                    // })
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