<template>
    <ul ref="scrollArea" class="scroll-wrap">
        <template v-for="item in currentData" :key="item.index">
            <li :data-scrollId="item.index" :data-offsetHeight="item.offsetHeight" :style="{position: 'absolute', transform: `translateY(${item.transformY || 0}px)`}">
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
import { defineComponent, ref, onMounted, Component, PropType, watchEffect, render } from 'vue'
import { debounce, cloneDeep } from 'lodash'
import { getScrollHeight, getScrollItemIndex } from './scroll'
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

        // init add index
        itemData.value = props.sourceData
        // method
        function renderTomstoneItem(direction: string, scrollItemNum: number) {
            let _data = cloneDeep(itemData.value)
            let _effectData = _data.filter(element => element.isVisible)
            let _effectDataLength = _effectData.length
            let _originIndex = 0
            let limit = 2 * props.initDataNum

            // scroll down, calculate the last visible item 
            _effectDataLength = _effectDataLength + scrollItemNum
            if(direction === 'down') {
                _originIndex = _effectData[_effectData.length - 1].index
                for(let i = 0; i < scrollItemNum; i++) {
                    _data[_originIndex + 1 + i].isVisible = true
                    _data[_originIndex + 1 + i].transformY = _data[_originIndex + i].transformY + tombstoneOffsetHeight.value
                }
                if(_effectDataLength > limit) {
                    let _preIndex = _effectData[0].index > 0 ? _effectData[0].index - 1 : 0

                    for(let i = 0; i < _effectDataLength - limit; i++) {
                        _data[_preIndex + i].isVisible = false
                    }
                }
                itemData.value = _data
                addQueue(new Promise(async (resolve, reject) => {
                    let data = await renderItem(_data[_originIndex + 1].index, _data[_originIndex + scrollItemNum].index)

                    utils.replaceArrayFragment(itemData.value, data, _data[_originIndex + 1].index, _data[_originIndex + scrollItemNum].index)
                    resolve()
                }))
            }
            if(direction === 'up') {
                _originIndex = _effectData[0].index
                for(let i = 0; i < scrollItemNum; i++) {
                    _data[_originIndex - 1 - i].isVisible = true
                }
                if(_effectDataLength > limit) {
                    let _endIndex = _effectData[_effectData.length - 1].index

                    for(let i = 0; i < _effectDataLength - limit; i++) {
                        _data[_endIndex - i].isVisible = false
                    }
                }
                itemData.value = _data
            }
        }
        async function renderItem(startIndex: number, endIndex: number): Promise<any[]> {
            let _originData = cloneDeep(itemData.value)

            for(let i = startIndex; i < endIndex + 1; i++) {
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
                }
            }
            return new Promise((resolve, reject) => {
                setTimeout(() => {
                    resolve(_originData)
                }, 200)
            })
        }
        watchEffect(() => {
            currentData.value = itemData.value.filter(elemenet => elemenet.isVisible)
        })
        onMounted(async () => {
            tombstoneOffsetHeight.value = <number>tombstoneTemplate.value?.offsetHeight
            itemData.value = utils.addTransformProperty(itemData.value, tombstoneOffsetHeight.value, tombstoneOffsetHeight.value, props.initDataNum)
            renderItem(0, props.initDataNum - 1)
            .then(data => {
                itemData.value = data
            })

            scrollArea.value?.addEventListener('scroll', debounce( async() => {
                let _distance = 0
                let _currentScrollTop = getScrollHeight(<HTMLElement>scrollArea.value)
                let _currentItemIndex
                let _currentTransformY
                let _effectData = itemData.value.filter(element => element.isVisible)
                let _scrollItemNum

                _distance = _currentScrollTop - beforeScrollTop.value
                if(_distance > 0) {
                    scrollDirection.value = 'down'
                    _currentTransformY = _distance + _effectData[_effectData.length - 1].transformY
                } else {
                    scrollDirection.value = 'up'
                    _currentTransformY = _distance + _effectData[0].transformY
                }
                _currentItemIndex = getScrollItemIndex(itemData.value, scrollDirection.value, _currentTransformY)
                if(scrollDirection.value === 'down') {
                    _scrollItemNum = _currentItemIndex - _effectData[_effectData.length - 1].index
                } else {
                    _scrollItemNum = _effectData[0].index - _currentItemIndex
                }
                
                if(!_scrollItemNum) {
                    return false
                }
                beforeScrollTop.value = _currentScrollTop
                renderTomstoneItem(scrollDirection.value, _scrollItemNum)
            }, 30))
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
.scroll-wrap li {
    transition: transform .2s ease-in-out;
}
.invisible {
    display: none;
}
</style>