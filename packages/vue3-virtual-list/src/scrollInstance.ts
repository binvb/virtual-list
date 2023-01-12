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
        document.body.addEventListener('keydown', onKeyDown.bind(null, data))
    }
}

export function removeScrollEvent(data: ReactiveData) {
    const container = document.querySelector(`.fishUI-virtual-list_${data.componentID}`)

    if(container) {
        container.removeEventListener('wheel', onUserScrolling.bind(null, undefined, undefined))
        container.removeEventListener('scroll', onScroll.bind(null, undefined, undefined))
        document.body.removeEventListener('keydown', onKeyDown.bind(null, data))
    }
}

function onUserScrolling(data:ReactiveData | undefined) {
    if(data) {
        const currrentScrollTop = utils.getScrollTop(data)
        const event = arguments[arguments.length - 1]

        data.userScrolling = true
        data.locationPosition = currrentScrollTop
        if(event && event.wheelDelta >= 0) {
            data.scrollingDirection = 'up'
        }
        if(event && event.wheelDelta < 0) {
            data.scrollingDirection = 'down'
        }
    }
}

function onKeyDown(data: ReactiveData) {
    const event = arguments[arguments.length - 1]

    if(event && event.keyCode === 38) {
        // up direction
        data.scrollingDirection = 'up'
    }
    if(event && event.keyCode === 40) {
        // down direction
        data.scrollingDirection = 'down'
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