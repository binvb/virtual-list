import { SourceData, ReactiveData, ItemProps } from "./index.d"

function sleep(period: number): Promise<boolean> {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve(true)
        },period)
    })
}

// get closed top item
function getCurrentTopIndex(dataList: SourceData[], top: number) {
    let afterDataList = dataList.filter(item => item.transformY! > top)

    if(afterDataList.length) {
        return afterDataList[0].index
    }
    return 0
}

async function calculateListHeight(data: ItemProps[], preItem?: ItemProps, cb?: Function) {
    const range = 1000

    for(let i = 0; i < range; i += 1){
        if(!data[i]) {
            cb && cb()
            return false
        }
        if(i === 0) {
            if(!preItem) {
                continue
            }
            data[0].transformY = preItem.transformY + preItem.offsetHeight
        } else {
            data[i].transformY = data[i - 1].transformY + data[i - 1].offsetHeight
        }
    }

    setTimeout(() => {
        calculateListHeight(data.slice(range, data.length), data[range], cb)
    }, 10)
}

function getCorrectCurrentData(data: ReactiveData, correctIndex: number, props:any ) {
    const initDataNum = props.initDataNum || 20
    const start = (correctIndex - initDataNum) || 0

    return data.sourceData.slice(start, start + 2 * initDataNum)
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
    const listHeight = getListHeight(data)

    // +1 to fix 0.5px bug
    if(scrollTop + viewPortOffsetHeight + 1 >= listHeight) {
        return true
    }

    return false
}

export default {
    indexExist,
    sleep,
    getRandom,
    getCurrentTopIndex,
    getScrollTop,
    getViewPortOffsetHeight,
    getListHeight,
    ifBottomPosition,
    calculateListHeight,
    getCorrectCurrentData
}