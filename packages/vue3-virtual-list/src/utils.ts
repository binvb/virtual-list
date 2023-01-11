import { SourceData, ReactiveData, ItemProps } from "./index.d"

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

function ifBottomPosition(data: ReactiveData) {
    const viewPortOffsetHeight = getViewPortOffsetHeight(data)
    const el = document.querySelectorAll(`.fishUI-virtual-list_${data.componentID} .fishUI-virtual-list__inner li`)

    // if empty return true
    if(!el || !el.length) {
        return true
    }
    if(data.locationPosition + viewPortOffsetHeight >= data.listHeight) {
        return true
    }

    return false
}

function getCurrentViewPortData(data: ReactiveData) {
    const scrollTop = getScrollTop(data) // range[scrollTop, scrollTop + viewportOffsetHeight]
    const viewPortOffset = getViewPortOffsetHeight(data)
    const _data:ItemProps[] = []

    data.currentData.forEach(item => {
        if((item.transformY + item.offsetHeight > scrollTop) && (item.transformY < scrollTop + viewPortOffset)) {
            _data.push(item)
        }
    })
    return _data
}

function checkIfCurrentViewPortData(data: ReactiveData, key: string) {
    const currentData = getCurrentViewPortData(data)

    return !!(currentData.find(item => item.nanoid === key))
}

export default {
    indexExist,
    getRandom,
    getCorrectTopIndex,
    getScrollTop,
    getViewPortOffsetHeight,
    ifBottomPosition,
    getCurrentViewPortData,
    checkIfCurrentViewPortData
}