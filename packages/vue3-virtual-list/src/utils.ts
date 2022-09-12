import { SourceData, ReactiveData, ItemProps } from "./index.d"

function sleep(period: number): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        },period)
    })
}

// get closed top item
function getCorrectTopIndex(dataList: SourceData[], top: number) {
    let afterDataList = dataList.filter(item => item.transformY! >= top)

    if(afterDataList.length) {
        return afterDataList[0].index
    }
    return 0
}

function indexExist(index: any) {
    if(typeof(index) === 'number') {
        return true
    }
    return  false
}

function getRandom() {
    return parseInt((Math.random() *10).toString())
}

function getScrollTop(data: ReactiveData) {
    return document.querySelector(`.fishUI-virtual-list_${data.componentID}`)!.scrollTop
}

function getViewPortOffsetHeight(data: ReactiveData) {
    return (document.querySelector(`.fishUI-virtual-list_${data.componentID}`) as HTMLElement).offsetHeight
}
function getListHeight(data: ReactiveData) {
    return (document.querySelector(`.fishUI-virtual-list_${data.componentID} .fishUI-virtual-list__inner`) as HTMLElement).offsetHeight
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
    sleep,
    getRandom,
    getCorrectTopIndex,
    getScrollTop,
    getViewPortOffsetHeight,
    ifBottomPosition,
    getListHeight
}