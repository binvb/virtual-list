import utils from './utils'
import { ReactiveData } from "./index.d"
import { nextTick } from 'vue'

// onScrollEnd is a debounce function
// wheel && up/down event only for record(current location, scroll direction, if user scrolling).
export function scrollEvent(scrollDebounceFn: Function, data: ReactiveData) {
    const container = document.querySelector(`.fishUI-virtual-list_${data.componentID}`)

    if(container) {
        container.addEventListener('wheel', onUserScrolling.bind(null, data, scrollDebounceFn))
        container.addEventListener('scroll', onScroll.bind(null, data, scrollDebounceFn))
    }
}

export function removeScrollEvent(data: ReactiveData) {
    const container = document.querySelector(`.fishUI-virtual-list_${data.componentID}`)

    if(container) {
        container.removeEventListener('wheel', onUserScrolling.bind(null, undefined, undefined))
        container.removeEventListener('scroll', onScroll.bind(null, undefined, undefined))
    }
}

function onUserScrolling(data:ReactiveData | undefined) {
    if(data) {
        const currrentScrollTop = utils.getScrollTop(data)

        data.userScrolling = true
        data.locationPosition = currrentScrollTop
    }
}

function onScroll(data:ReactiveData | undefined, scrollDebounceFn?: Function,) {
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

// execCount for already resize but container still not render yet
// why 3 times limit? still need to figure render timming
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
    if(position + utils.getViewPortOffsetHeight(data) > (container as HTMLElement).offsetHeight && execCount < 3) {
        nextTick(() => {
            ajustAction(position, data, execCount)
        })
    } else {
        execCount = 0
    }
}