import utils from './utils'
import { ReactiveData, VirtualListComponent } from "./index.d"
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
        data.userScrolling = true
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

export function checkIfScrollToBottom(component: VirtualListComponent) {
	if(component.props.direction === 'up' && utils.ifBottomPosition(component.data)) {
		nextTick(() => {
			scrollToBottom(component.data)
		})
	}
}

export function scrollToBottom(data: ReactiveData) {
    ajustAction(data.listHeight, data)
    data.locationPosition = data.listHeight
}

export function ajustScrollPosition(offset: number, data: ReactiveData) {
    let currentScrollPosition = utils.getScrollTop(data)

    if(offset) {
        ajustAction(currentScrollPosition + offset, data)
    }
}

export function ajustAction(position: number, data: ReactiveData) {
    let component = document.querySelector(`.fishUI-virtual-list_${data.componentID}`)

    if(component) {
        component.scrollTo(0, position)
    }
    component = null
}