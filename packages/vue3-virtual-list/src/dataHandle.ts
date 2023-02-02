import { nanoid } from 'nanoid'
import { SourceData, Props, ReactiveData, ItemBase, VirtualListComponent } from './index.d'
import utils from './utils'
import { nextTick } from 'vue'

function resetSourceDataBeforeLocate(sourceData: SourceData[], endIndex:number) {
    let len = endIndex
    const sourceLen = sourceData.length

    if(len > sourceLen) {
        len = sourceLen
    }
    for(let i = 1; i < len; i += 1) {
        const _pre =  sourceData[i - 1]

        sourceData[i].transformY = _pre.transformY! + _pre.offsetHeight!
    }
    // delay excute behind data update
    nextTick(() => {
        if(len < sourceLen) {
            for(let i = len; i < sourceLen; i += 1) {
                const _pre =  sourceData[i - 1]

                sourceData[i].transformY = _pre.transformY! + _pre.offsetHeight!
            }
        }
    })
}

function itemBaseToItem(data: ItemBase[]): SourceData[] {
    return data.map(item => {
        return {index: 0, transformY: 0, nanoid: nanoid(), offsetHeight: 0, ...item}
    })
}

function sourceDataInitail(component: VirtualListComponent, newVal?: SourceData[]){
    let _data = newVal ? newVal : component.data.sourceData

    _data.forEach((item, index) => {
        let _pre = component.data.sourceData[index - 1]

        if(!component.data.sourceData[index]) {
            component.data.sourceData[index] = {...item}
        }
        if(!component.data.sourceData[index].nanoid) {
            component.data.sourceData[index].nanoid = nanoid()
        }
        component.data.sourceData[index].index = index
        component.data.sourceData[index].offsetHeight = item.offsetHeight || component.props.height
        component.data.sourceData[index].transformY = _pre ? (_pre.transformY! + _pre.offsetHeight!) : component.props.height * index
    })
    // splice rest item
    if(newVal) {
        component.data.sourceData.splice(newVal.length, 1000000000)
    }

    return component.data.sourceData
}

function del(index: number | number[], component: VirtualListComponent) {
    if(index instanceof Array) {
        index.forEach(_index => {
            component.data.listHeight -= component.data.sourceData[_index].offsetHeight
            component.data.sourceData.splice(_index, 1)
        })
    } else {
        component.data.listHeight -= component.data.sourceData[index].offsetHeight
        component.data.sourceData.splice(index, 1)
    }
    sourceDataInitail(component)
    resetCurrentData(component, getCorrectCurrentDataStartIndex(component.data, component.props))
}

function add(index: number, insertData: ItemBase[], component: VirtualListComponent) {
    let _index = index

    // splice feature
    if(index !== 0) {
        ++_index
    }
    
    component.data.sourceData.splice(_index, 0, ...itemBaseToItem(insertData))
    sourceDataInitail(component)
    resetCurrentData(component, getCorrectCurrentDataStartIndex(component.data, component.props))
}

function update(index: number, data: ItemBase, sourceData: SourceData[]) {
    Object.keys(data).forEach(key => {
        sourceData[index][key] = data[key]
    })
}

function setSourceData(newData: any[], component: VirtualListComponent) {
    sourceDataInitail(component, newData)
    resetCurrentData(component, getCorrectCurrentDataStartIndex(component.data, component.props))
}

function getCorrectCurrentDataStartIndex(data: ReactiveData, props: Props): number {
    const { perPageItemNum } = props
    let {sourceData, currentData} = data
    let startIndex = currentData[0] ? currentData[0].index : 0 // default

    if(!sourceData.length) {
        return 0
    }
    // if currentData was not subset sourceData e.g. current: [50,...100], sourceData: [1, ...80]
    if(currentData.length && currentData[currentData.length - 1] && currentData[currentData.length - 1].index > sourceData[sourceData.length - 1].index) {
        startIndex = sourceData.length - perPageItemNum * 2
    }
    // if top position, reset startIndex to include new item
    if(props.direction === 'up' && utils.getScrollTop(data) === 0) {
        startIndex -= perPageItemNum
    }
    return startIndex
}

function resetCurrentData(component: VirtualListComponent, startIndex: number) {
    let { sourceData } = component.data
    const len = sourceData.length > component.props.perPageItemNum * 2 ? component.props.perPageItemNum * 2 : sourceData.length
    let _startIndex = startIndex

    if(_startIndex < 0) {
        _startIndex = 0
    }

    // remove old data
    component.data.currentData = []
    for(let i = 0; i < len; i += 1) {
        if(sourceData[_startIndex + i]) {
            component.data.currentData[i] = sourceData[_startIndex + i]
        }
    }
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