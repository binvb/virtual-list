import { SourceData, ReactiveData } from "./index.d"

// get closed top item
function getCorrectTopIndex(dataList: SourceData[], top: number) {
    for(let length = dataList.length, i = 0; i < length; i += 1) {
        if(dataList[i].transformY! >= top) {
            return i
        }
    }
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
    let component = document.querySelector(`.fishUI-virtual-list_${data.componentID}`)
    const scrollTop = (component as HTMLElement).scrollTop || 0

    component = null
    return scrollTop
}

function getViewPortOffsetHeight(data: ReactiveData) {
    let el = document.querySelector(`.fishUI-virtual-list_${data.componentID}`)
    let elOffsetHeight
    if(el) {
        elOffsetHeight = (el as HTMLElement).offsetHeight
    }
    el = null
    return elOffsetHeight || 0
}
function getListHeight(data: ReactiveData) {
    let el = document.querySelector(`.fishUI-virtual-list_${data.componentID} .fishUI-virtual-list__inner`)
    const offsetHeight = (el as HTMLElement).offsetHeight

    el = null
    return offsetHeight || 0
}

function ifBottomPosition(data: ReactiveData) {
    const scrollTop = getScrollTop(data)
    const viewPortOffsetHeight = getViewPortOffsetHeight(data)

    // +1 to fix 0.5px bug
    if(scrollTop + viewPortOffsetHeight + 1 >= getListHeight(data)) {
        return true
    }

    return false
}

export default {
    indexExist,
    getRandom,
    getCorrectTopIndex,
    getScrollTop,
    getViewPortOffsetHeight,
    ifBottomPosition,
    getListHeight
}