import { nanoid } from 'nanoid'
import observeHandle from './observeHandle'
import { SourceData, ItemProps, Observer, ReactiveData } from './index.d'
import utils from './utils'

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
            sourceData[index] = ({nanoid: nanoid(), ...item} as ItemProps)
        }
        if(!sourceData[index].nanoid) {
            sourceData[index].nanoid = nanoid()
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
        index.forEach(_index => {
            data.listHeight -= sourceData[_index].offsetHeight
            sourceData.splice(_index, 1)
        })
    } else {
        data.listHeight -= sourceData[index].offsetHeight
        sourceData.splice(index, 1)
    }
    sourceDataInitail(data, retainHeightValue)
    resetCurrentData(data, observer, props, getCurrentIndex(data, props))
}

function add(index: number, insertData: any[], data: ReactiveData, observer: Observer, props:any) {
    const {retainHeightValue} = props
    let {sourceData} = data

    sourceData.splice(index,0, ...insertData)
    sourceDataInitail(data, retainHeightValue)
    resetCurrentData(data, observer, props, getCurrentIndex(data, props))
}

function update(index: number, data: any, sourceData: ItemProps[]) {
    Object.keys(data).forEach(key => {
        sourceData[index][key] = data[key]
    })
}

function setSourceData(newData: any[], data: ReactiveData, observer: Observer, props: any) {
    const {retainHeightValue} = props

    sourceDataInitail(data, retainHeightValue, newData)
    resetCurrentData(data, observer, props, getCurrentIndex(data, props))
}

function getCurrentIndex(data: ReactiveData, props: any): number {
    const { initDataNum } = props
    let {sourceData, currentData} = data

    if(!sourceData.length) {
        currentData.splice(0, 10000)
        return 0
    }
    let startIndex = currentData[0] ? (currentData[0].index > sourceData[sourceData.length - 1].index ? 0 : currentData[0].index) : 0

    // if bottom position,reset startIndex to include new item
    if(props.direction === 'up' && utils.ifBottomPosition(data)) {
        startIndex = sourceData.length - initDataNum * 2
    }

    return startIndex
}

function resetCurrentData(data: ReactiveData, observer: Observer, props: any, startIndex: number) {
    const {sourceData, currentData} = data
    const len = sourceData.length > props.initDataNum * 2 ? props.initDataNum * 2 : sourceData.length

    // unobserve
    observeHandle.unobserve(currentData, observer, data)
    for(let i = 0; i < len; i += 1) {
        if(sourceData[startIndex + i]) {
            currentData[i] = sourceData[startIndex + i]
        } else {
            currentData.splice(i, 1)
        }
    }
    if(currentData.length > len) {
        currentData.splice(len, 10000)
    }
    console.log(`${JSON.stringify(currentData)}`)
    // observe
    observeHandle.observe(currentData, observer, data)
}


export default {
    resetSourceDataBeforeLocate,
    del,
    add,
    update,
    setSourceData,
    sourceDataInitail,
    resetCurrentData
}