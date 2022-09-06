import utils from './utils'
import { ReactiveData } from "./index.d"

// onScrollEnd is a debounce function
export function scrollEvent(scrollDebounceFn: Function, data: ReactiveData) {
    document.querySelector(`.fishUI-virtual-list_${data.componentID}`)!.addEventListener('scroll', onScrolling.bind(null, data, scrollDebounceFn))
}

export function removeScrollEvent(data: ReactiveData) {
    document.querySelector(`.fishUI-virtual-list_${data.componentID}`)!.removeEventListener('scroll', onScrolling.bind(null, undefined, undefined))
}

function onScrolling(data:ReactiveData | undefined, scrollDebounceFn?: Function) {
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

export function scrollToBottom(data: ReactiveData) {
    ajustAction(10000000000000000, data)
}

export function ajustScrollPosition(offset: number, data: ReactiveData) {
    let currentScrollPosition = utils.getScrollTop(data)

    if(offset) {
        ajustAction(currentScrollPosition + offset, data)
    }
}

export function ajustAction(position: number, data: ReactiveData) {
    document.querySelector(`.fishUI-virtual-list_${data.componentID}`)!.scrollTo(0, position)
}