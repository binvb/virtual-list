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
    let _data = newVal ? newVal : data.sourceData

    _data.forEach((item, index) => {
        let pre = data.sourceData[index - 1]

        if(!data.sourceData[index]) {
            data.sourceData[index] = ({nanoid: nanoid(), ...item} as ItemProps)
        }
        if(!data.sourceData[index].nanoid) {
            data.sourceData[index].nanoid = nanoid()
        }
        data.sourceData[index].index = index
        data.sourceData[index].offsetHeight = item.offsetHeight || retainHeightValue
        data.sourceData[index].transformY = pre ? (pre.transformY! + pre.offsetHeight!) : retainHeightValue * index
    })
    // splice rest item
    if(newVal) {
        data.sourceData.splice(newVal.length, 1000000000)
    }

    return (data.sourceData as ItemProps[])
}

function del(index: number | number[], data: ReactiveData, observer: Observer, props:any) {
    const { retainHeightValue } = props

    if(index instanceof Array) {
        index.forEach(_index => {
            data.listHeight -= data.sourceData[_index].offsetHeight
            data.sourceData.splice(_index, 1)
        })
    } else {
        data.listHeight -= data.sourceData[index].offsetHeight
        data.sourceData.splice(index, 1)
    }
    sourceDataInitail(data, retainHeightValue)
    resetCurrentData(data, observer, props, getCurrentIndex(data, props))
}

function add(index: number, insertData: any[], data: ReactiveData, observer: Observer, props:any) {
    const {retainHeightValue} = props

    data.sourceData.splice(index,0, ...insertData)
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
    // 这里还有问题，如果之前的currentData开始是20，后面更新后的sourceData只有19个数据，那就只展示两个数据了。 # TODO 
    let startIndex = currentData[0] ? (currentData[0].index > sourceData[sourceData.length - 1].index ? 0 : currentData[0].index) : 0

    // if bottom position,reset startIndex to include new item
    if(props.direction === 'up' && utils.ifBottomPosition(data)) {
        startIndex = sourceData.length - initDataNum * 2
    }

    return startIndex
}

function resetCurrentData(data: ReactiveData, observer: Observer, props: any, startIndex: number) {
    let {sourceData} = data
    const len = sourceData.length > props.initDataNum * 2 ? props.initDataNum * 2 : sourceData.length
    let _startIndex = startIndex
    
    if(_startIndex < 0) {
        _startIndex = 0
    }
    // unobserve
    observeHandle.unobserve(data.currentData, observer, data)
    // remove old data
    data.currentData = []
    for(let i = 0; i < len; i += 1) {
        if(sourceData[_startIndex + i]) {
            data.currentData[i] = sourceData[_startIndex + i]
        }
    }
    // observe
    observeHandle.observe(data.currentData, observer, data)
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