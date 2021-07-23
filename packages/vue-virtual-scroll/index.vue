<template>
    <ul ref="scrollArea" class="scroll-wrap">
        <template v-for="item in currentData" :key="item.index">
            <li :data-scrollId="item.index" :style="{position: 'absolute', transform: `translateY(${item.transformY || 0}px)`}">
                <component v-if="item.isTombstone" :is="Tombstone" :itemData="item" :key="item.index"></component>
                <component v-if="!item.isTombstone" :is="ScrollItem" :itemData="item" :key="item.index"></component>
            </li>
        </template>
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
import { defineComponent, ref, onMounted, Component, PropType, watchEffect, watch } from 'vue'
import { debounce } from 'lodash'
import { getScrollHeight, getScrollItemIndex, getCurrentTopItemIndex} from './scroll'
import * as utils from './utils'
import addQueue from './queue'

export default defineComponent({
    inheritAttrs: false,
    props: {
        initDataNum: {
            type: Number,
            default: 50,
        },
        ScrollItem: {
            type: Object as PropType<Component>,
            required: true
        },
        Tombstone: {
            type: Object as PropType<Component>,
            required: true
        },
        sourceData: {
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
        const itemData = ref<any[]>([])
        const currentData = ref<any[]>([])
        const tombstoneOffsetHeight = ref<number>(0)
        const templateClass = ref<string>('invisible')
        const templateData = ref<{}>({})
        const beforeScrollTop  = ref<number>(0)
        const scrollDirection = ref<'up' | 'down'>('down')
        const currentItemIndex = ref<number>(0)

        // init
        itemData.value = props.sourceData
        // method
        function renderTomstoneItem(direction: string, scrollItemNum: number) {
            let _effectData = itemData.value.filter(element => element.isVisible)
            let _effectDataLength = _effectData.length
            let _originIndex = 0
            let _item 

            _effectDataLength = _effectDataLength + scrollItemNum
            if(direction === 'down') {
                _originIndex = _effectData[_effectData.length - 1].index
                for(let i = 0; i < scrollItemNum; i++) {
                    _item = Object.assign(itemData.value[_originIndex + 1 + i], {
                        isVisible: true, 
                        transformY: itemData.value[_originIndex + i].transformY + itemData.value[_originIndex + i].offsetHeight, 
                        isTombstone: itemData.value[_originIndex + 1 + i].isTombstone === false ? false : true
                    })
                    itemData.value.splice(_originIndex + 1 + i, 1, _item)
                }
                addQueue(() => {
                    return renderItem(itemData.value[_originIndex + 1].index, itemData.value[_originIndex + scrollItemNum].index)
                })
            }
            if(direction === 'up') {
                _originIndex = _effectData[0].index
                for(let i = 0; i < scrollItemNum; i++) {
                    _item = Object.assign(itemData.value[_originIndex - 1 - i], {isVisible: true})
                    itemData.value.splice(_originIndex - 1 - i, 1, _item)
                }
            }
        }
        async function renderItem(startIndex: number, endIndex: number) {
            for(let i = startIndex; i < endIndex + 1; i++) {
                let _item

                templateData.value = itemData.value[i]
                await utils.sleep(0)
                _item = Object.assign(itemData.value[i], {isTombstone: false, offsetHeight: itemTemplate.value?.offsetHeight})
                if(i === 0) {
                    _item.transformY = 0
                } else {
                    _item.transformY = itemData.value[i-1].offsetHeight + itemData.value[i-1].transformY
                }
                itemData.value.splice(i, 1, _item)
            }
            await utils.sleep(0)
        }
        function recycle() {
            let _limitNum = 2 * props.initDataNum
            let _item
            let _beforCurrentData
            let _afterCurrentData
            let _currentItemIndex = 0

            _currentItemIndex = getCurrentTopItemIndex(itemData.value, getScrollHeight(<HTMLElement>scrollArea.value))
            _beforCurrentData = currentData.value.filter(element => element.index < _currentItemIndex)
            _afterCurrentData = currentData.value.filter(element => element.index >= _currentItemIndex)
            console.log(_currentItemIndex, scrollDirection.value, getScrollHeight(<HTMLElement>scrollArea.value), '看下currentIndex')
            if(_beforCurrentData.length > _limitNum) {
                for(let i = 0; i < _beforCurrentData.length - _limitNum; i++) {
                    _item = Object.assign(itemData.value[currentData.value[i].index], {isVisible: false})
                    itemData.value.splice(currentData.value[i].index, 1, _item)
                }
            }
            if(_afterCurrentData.length > _limitNum) {
                for(let i = 0; i < _afterCurrentData.length - _limitNum; i++) {
                    _item = Object.assign(itemData.value[currentData.value[currentData.value.length - 1 - i].index], {isVisible: false})
                    itemData.value.splice(currentData.value[currentData.value.length - 1 - i].index, 1, _item)
                }
            }
        }
        watchEffect(() => {
            currentData.value = itemData.value.filter(elemenet => elemenet.isVisible)
            if(currentData.value.length > props.initDataNum * 2) {
                recycle()
            }
        })
        onMounted(async () => {
            tombstoneOffsetHeight.value = <number>tombstoneTemplate.value?.offsetHeight
            itemData.value = utils.addTransformProperty(itemData.value, tombstoneOffsetHeight.value, tombstoneOffsetHeight.value, props.initDataNum)
            renderItem(0, props.initDataNum - 1)

            scrollArea.value?.addEventListener('scroll', () => {
                let _distance = 0
                let _currentScrollTop = getScrollHeight(<HTMLElement>scrollArea.value)
                let _currentTransformY
                let _scrollItemNum

                _distance = _currentScrollTop - beforeScrollTop.value
                if(_distance > 0) {
                    scrollDirection.value = 'down'
                    _currentTransformY = _distance + currentData.value[currentData.value.length - 1].transformY
                } else {
                    scrollDirection.value = 'up'
                    _currentTransformY = _distance + currentData.value[0].transformY
                }
                currentItemIndex.value = getScrollItemIndex(itemData.value, scrollDirection.value, _currentTransformY, scrollDirection.value === 'down' ? currentData.value[currentData.value.length - 1].index : currentData.value[0].index)
                if(scrollDirection.value === 'down') {
                    _scrollItemNum = currentItemIndex.value - currentData.value[currentData.value.length - 1].index
                } else {
                    _scrollItemNum = currentData.value[0].index - currentItemIndex.value
                }
                if(_scrollItemNum <= 0) {
                    beforeScrollTop.value = _currentScrollTop
                    return false
                }
                beforeScrollTop.value = _currentScrollTop
                renderTomstoneItem(scrollDirection.value, _scrollItemNum)
            })
        })

        return {
            itemData,
            currentData,
            tombstoneTemplate,
            templateData,
            templateClass,
            itemTemplate,
            scrollArea,
            ...props,
        }
    },
})
</script>
<style lang="less" scoped>
.scroll-wrap {
  position: absolute;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
  overflow-y: scroll;
  -webkit-overflow-scrolling: touch;
  width: 100%;
  height: 100%;
}
.scroll-wrap li {
    transition: transform .2s ease-in-out;
}
.invisible {
    display: none;
}
</style>