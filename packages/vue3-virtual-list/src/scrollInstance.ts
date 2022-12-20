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

export function checkIfScrollToBottom(component: VirtualListComponent, oldListHeight: number) {
    // chat mode(direction === 'up' && bottom position)
	if(component.props.direction === 'up' && utils.ifBottomPosition(component.data, oldListHeight)) {
		nextTick(() => {
			scrollToBottom(component.data)
		})
	}
}

export function scrollToBottom(data: ReactiveData) {
    ajustAction(data.listHeight, data)
    data.locationPosition = data.listHeight
}

export function ajustAction(position: number, data: ReactiveData) {
    const component = document.querySelector(`.fishUI-virtual-list_${data.componentID}`)

    if(component) {
        component.scrollTo(0, position)
    }
}