import { nextTick } from 'vue'
import { nanoid } from 'nanoid'
import observeHandle from './observeHandle'
import { SourceData, ItemProps, Observer, ReactiveData } from './index.d'
import utils from './utils'
import { scrollToBottom } from './scrollInstance'

// when rendered, current data will update offsetHeight && transformY
// when current data updated, avoid complex calculation, do not update all data all the time
// only update in some case
function resetSourceDataBeforeLocate(sourceData: SourceData[], endIndex:number) {
    for(let i = 0; i <= endIndex; i += 1) {
        if(!sourceData[i]) {
            return
        }
        if(i === 0) {
            sourceData[i].transformY = 0
        } else {
            sourceData[i].transformY = sourceData[i - 1].transformY! + sourceData[i - 1].offsetHeight!
        }
    }
}

function sourceDataInitail(data: ReactiveData, retainHeightValue: number, newVal?: SourceData[]){
    const { sourceData } = data
    let _data = newVal?.length ? newVal : sourceData

    _data.forEach((item, index) => {
        let pre = sourceData[index - 1]

        if(!sourceData[index]) {
            const _nanoid = item.nanoid || nanoid()
            
            sourceData[index] = ({nanoid: _nanoid, ...item} as ItemProps)
        }
        sourceData[index].index = index
        sourceData[index].offsetHeight = item.offsetHeight || retainHeightValue
        sourceData[index].transformY = pre ? (pre.transformY! + pre.offsetHeight!) : retainHeightValue * index
    })
    // splice rest item
    if(newVal) {
        sourceData.splice(newVal.length, 1000000000)
    }

    return (sourceData as ItemProps[])
}

function del(index: number | number[], data: ReactiveData, observer: Observer, props:any) {
    const { retainHeightValue } = props
    let { sourceData } = data

    if(index instanceof Array) {
        index.forEach(item => {
            sourceData.splice(item, 1)
        })
    } else {
        sourceData.splice(index, 1)
    }
    sourceDataInitail(data, retainHeightValue)
    resetCurrentData(data, observer, props)
}

function add(index: number, insertData: any[], data: ReactiveData, observer: Observer, props:any) {
    const {retainHeightValue} = props
    let {sourceData} = data
    let isScrollBottom = utils.ifBottomPosition(data)

    sourceData.splice(index,0, ...insertData)
    sourceDataInitail(data, retainHeightValue)
    resetCurrentData(data, observer, props)
    nextTick(() => {
        if(isScrollBottom && props.loadingOptions && props.direction === 'up') {
            scrollToBottom(data)
        }
    })
}

function update(index: number, data: any, sourceData: ItemProps[]) {
    Object.keys(data).forEach(key => {
        sourceData[index][key] = data[key]
    })
}

function setSourceData(newData: any[], data: ReactiveData, observer: Observer, props: any) {
    const {retainHeightValue} = props

    sourceDataInitail(data, retainHeightValue, newData)
    resetCurrentData(data, observer, props)
    nextTick(() => {
        // if direction === 'up', then scroll to bottom
        if(props.direction === 'up' && props.loadingOptions) {
            scrollToBottom(data)
        }
    })
}

function resetCurrentData(data: ReactiveData, observer: Observer, props: any) {
    const { initDataNum } = props
    let {sourceData, currentData} = data

    if(!sourceData.length) {
        currentData.splice(0, 10000)
        return 
    }
    // if current Data exist, still use current Data, only change position
    let startIndex = currentData[0] ? (currentData[0].index > sourceData[sourceData.length - 1].index ? 0 : currentData[0].index) : 0
    let len = sourceData.length > initDataNum * 2 ? initDataNum * 2 : sourceData.length
    const strollTop = utils.getScrollTop(data)

    // if in top position and not loading mode, need start in sourceData[0]
    if(strollTop === 0 && !props.loadingFn) {
        startIndex = 0
    }
    // unobserve
    observeHandle.unobserve(currentData, observer, data)
    for(let i = 0; i < len; i += 1) {
        let _data = sourceData[startIndex + i]

        if(_data) {
            currentData[i] = _data
        }
    }
    if(currentData.length > len) {
        currentData.splice(len, 10000)
    }
    // observe
    observeHandle.observe(currentData, observer, data)
}


export default {
    resetSourceDataBeforeLocate,
    sourceDataInitail,
    del,
    add,
    update,
    setSourceData,
    resetCurrentData
}