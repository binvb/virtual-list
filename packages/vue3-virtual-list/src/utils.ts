import { SourceData, ReactiveData } from "./index.d"

// get closed top item
function getCorrectTopIndex(dataList: SourceData[], top: number) {
    for(let length = dataList.length, i = 0; i < length; i += 1) {
        if(dataList[i].transformY! >= top) {
            return i
        }
    }
    return dataList.length ? dataList.length - 1 : 0
}

function indexExist(index: any) {
    if(typeof(index) === 'number') {
        return true
    }
    return  false
}

function getRandom() {
    return parseInt((Math.random() *10).toString(), 10)
}

function getScrollTop(data: ReactiveData) {
    const component = document.querySelector(`.fishUI-virtual-list_${data.componentID}`)
    const scrollTop = component ? component.scrollTop : 0

    return scrollTop
}

function getViewPortOffsetHeight(data: ReactiveData) {
    const el = document.querySelector(`.fishUI-virtual-list_${data.componentID}`)
    let elOffsetHeight
    
    if(el) {
        elOffsetHeight = (el as HTMLElement).offsetHeight
    }
    return elOffsetHeight || 0
}
function getListHeight(data: ReactiveData) {
    const el = document.querySelector(`.fishUI-virtual-list_${data.componentID} .fishUI-virtual-list__inner`)
    const offsetHeight = (el as HTMLElement).offsetHeight

    return offsetHeight || 0
}

export default {
    indexExist,
    getRandom,
    getCorrectTopIndex,
    getScrollTop,
    getViewPortOffsetHeight,
    getListHeight
}