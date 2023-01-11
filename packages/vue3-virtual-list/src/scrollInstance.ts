import utils from './utils'
import { ReactiveData } from "./index.d"
import { nextTick } from 'vue'

// onScrollEnd is a debounce function
export function scrollEvent(scrollDebounceFn: Function, data: ReactiveData) {
    document.querySelector(`.fishUI-virtual-list_${data.componentID}`)!.addEventListener('wheel', onUserScrolling.bind(null, data, scrollDebounceFn))
    document.querySelector(`.fishUI-virtual-list_${data.componentID}`)!.addEventListener('scroll', onScroll.bind(null, data, scrollDebounceFn))
}

export function removeScrollEvent(data: ReactiveData) {
    document.querySelector(`.fishUI-virtual-list_${data.componentID}`)!.removeEventListener('wheel', onUserScrolling.bind(null, undefined, undefined))
    document.querySelector(`.fishUI-virtual-list_${data.componentID}`)!.removeEventListener('scroll', onScroll.bind(null, undefined, undefined))
}

function onUserScrolling(data:ReactiveData | undefined) {
    if(data) {
        let currrentScrollTop = utils.getScrollTop(data)
        
        data.userScrolling = true
        data.locationPosition = currrentScrollTop
    }
}
function onScroll(data:ReactiveData | undefined, scrollDebounceFn?: Function) {
    if(data) {
        data.scrolling = true
    }
    if(scrollDebounceFn) {
        scrollDebounceFn()
    }
}

export function locatePosition(position: number, data: ReactiveData) {
    ajustAction(position, data)
    data.ajusting = true
}

export function ajustAction(position: number, data: ReactiveData, execCount:number = 0,) {
    const el = document.querySelector(`.fishUI-virtual-list_${data.componentID}`)

    if(!el) {
        return
    }
    const container = el.querySelector('.fishUI-virtual-list__inner')

    execCount++
    if(el) {
        el.scrollTo(0, position)
    }
    if(container && data.listHeight > (container as HTMLElement).offsetHeight && execCount < 3) {
        nextTick(() => {
            ajustAction(position, data, execCount)
        })
    } else {
        execCount = 0
    }
}