<template>
    <ul ref="scrollArea" class="scroll-wrap">
        <template v-for="item in itemData" :key="item.index">
            <li :data-scrollId="item.index" v-if="item.isVisible" :style="{position: 'absolute', transform: `translateY(${item.transformY || 0}px)`}">
                <component v-if="item.isTombstone && item.isVisible" :is="Tombstone" :itemData="item" :key="item.index"></component>
                <component v-if="!item.isTombstone && item.isVisible" :is="ScrollItem" :itemData="item" :key="item.index"></component>
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
import { defineComponent, ref, onMounted, Component, PropType } from 'vue'
import { debounce, cloneDeep, isEmpty } from 'lodash'
import { getScrollHeight, getScrollItemIndex } from './scroll'
import * as utils from './utils'

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
        const tombstoneOffsetHeight = ref<number>(0)
        const templateClass = ref<string>('invisible')
        const templateData = ref<{}>({})
        const beforeScrollTop  = ref<number>(0)
        const scrollDirection = ref<'up' | 'down'>('down')

        // add index
        itemData.value = utils.addIndexProperty(props.sourceData)
        function renderTomstoneItem(showItemNum: number=props.initDataNum, showItemIndex: number = 0, direction?: string) {
            let _data = cloneDeep(itemData.value)
            let originDistance = 0
            let countLength = showItemIndex + showItemNum

            // done
            if(countLength > _data.length) {
                countLength = _data.length
            }
            for(let i = showItemIndex; i < countLength; i++) {
                // originIndex = ((originData.index || -1) + 1) + i
                if(showItemIndex === 0 && i === 0) {
                    _data[i].transformY = 0
                } else {
                    originDistance = _data[i-1].transformY
                    originDistance += tombstoneOffsetHeight.value
                    _data[i].transformY = originDistance
                }
                _data[i].isTombstone = true
                _data[i].isVisible = true
                console.log(direction, '看看方向')
                // if(direction === 'down') {
                //     _data[i - 20].isVisible = false
                // }
                // if(direction === 'up') {
                //     _data[i + 20].isVisible = false
                // }
            }
            itemData.value = _data
            renderItem()
            .then(data => {
                itemData.value = data
            })
        }
        async function renderItem(): Promise<any[]> {
            let _originData = cloneDeep(itemData.value)
            let _originDataLength = _originData.length

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
            renderTomstoneItem()
            scrollArea.value?.addEventListener('scroll', debounce( async() => {
                let _distance = 0
                let _currentScrollTop = getScrollHeight(<HTMLElement>scrollArea.value)
                let _currentIndex = 0
                let _beforeIndex = 0
                let _scrollItemNum = 0
                let _effectData = []

                _distance = _currentScrollTop - beforeScrollTop.value
                if(_distance > 0) {
                    scrollDirection.value = 'down'
                } else {
                    scrollDirection.value = 'up'
                }
                _currentIndex = getScrollItemIndex(itemData.value, scrollDirection.value, _currentScrollTop)
                _beforeIndex = getScrollItemIndex(itemData.value, scrollDirection.value, beforeScrollTop.value)
                _scrollItemNum = Math.abs(_currentIndex - _beforeIndex)
                console.log(_scrollItemNum, '滚动数量')
                if(!_scrollItemNum) {
                    return 
                }
                _effectData = itemData.value.filter(element => element.isVisible)
                if(scrollDirection.value === 'down') {
                    if(_effectData.length === props.sourceData.length) {
                        return false
                    }
                    renderTomstoneItem(_scrollItemNum, _effectData[_effectData.length - 1].index + 1, scrollDirection.value)
                } else {
                    // renderTomstoneItem(_scrollItemNum, _effectData[0].index - 1, scrollDirection.value)
                }
                beforeScrollTop.value = _currentScrollTop
            }, 30))
        })

        return {
            itemData,
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