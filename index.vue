<template>
    <ul ref="scrollArea" class="scroll-wrapper" data-testid="scroll-wrapper">
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
        <li ref="tombstoneTemplate" data-testid="tombstoneTemplate">
            <component :is="Tombstone"></component>
        </li>
    </ul>
</template>
<script lang="ts">
import { defineComponent, ref, onMounted, Component, PropType, watchEffect } from 'vue'
import { debounce } from 'lodash'
import { getScrollHeight, getOffsetHeight, getScrollItemIndex, getCurrentTopItemIndex} from './scroll'
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

        itemData.value = props.sourceData
        function renderTomstoneItem(direction: string, scrollItemNum: number) {
            let _effectData = itemData.value.filter(element => element.isVisible)
            let _originIndex = 0
            let _item 

            if(direction === 'down') {
                _originIndex = _effectData[_effectData.length - 1].index
                for(let i = 0; i < scrollItemNum; i++) {
                    _item = Object.assign(itemData.value[_originIndex + 1 + i], {
                        isVisible: true, 
                        transformY: itemData.value[_originIndex + i].transformY + getOffsetHeight(itemData.value[_originIndex + i]), 
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
                _item = Object.assign(itemData.value[i], {isTombstone: false, offsetHeight: getOffsetHeight(<HTMLElement>itemTemplate.value)})
                if(i === 0) {
                    _item.transformY = 0
                } else {
                    _item.transformY = getOffsetHeight(itemData.value[i-1]) + itemData.value[i-1].transformY
                }
                itemData.value.splice(i, 1, _item)
            }
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
            tombstoneOffsetHeight.value = getOffsetHeight(<HTMLElement>tombstoneTemplate.value)
            utils.addTransformProperty(itemData.value, tombstoneOffsetHeight.value, tombstoneOffsetHeight.value, props.initDataNum)
            renderItem(0, props.initDataNum - 1)
            scrollArea.value?.addEventListener('scroll', debounce(() => {
                let _distance = 0
                let _currentScrollTop = getScrollHeight(<HTMLElement>scrollArea.value)
                let _currentTransformY
                let _scrollItemNum
                let _currentDataLastItem = currentData.value[currentData.value.length - 1]

                _distance = _currentScrollTop - beforeScrollTop.value
                if(_distance > 0) {
                    scrollDirection.value = 'down'
                    _currentTransformY = _distance + _currentDataLastItem.transformY
                } else {
                    scrollDirection.value = 'up'
                    _currentTransformY = _distance + currentData.value[0].transformY
                }
                currentItemIndex.value = getScrollItemIndex(itemData.value, scrollDirection.value, _currentTransformY, scrollDirection.value === 'down' ? _currentDataLastItem.index : currentData.value[0].index)
                if(scrollDirection.value === 'down') {
                    _scrollItemNum = currentItemIndex.value - _currentDataLastItem.index
                } else {
                    _scrollItemNum = currentData.value[0].index - currentItemIndex.value
                }
                if(_currentDataLastItem.index + _scrollItemNum > itemData.value.length) {
                    _scrollItemNum = itemData.value.length - _currentDataLastItem.index
                }
                if(_scrollItemNum < 1) {
                    return false
                }
                beforeScrollTop.value = _currentScrollTop
                renderTomstoneItem(scrollDirection.value, _scrollItemNum)
            }, 20))
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