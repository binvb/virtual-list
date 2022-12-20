import { nextTick } from 'vue'
import { Observer, ReactiveData, ItemProps } from './index.d'
import utils from './utils'

function observe(observeList: ItemProps[], observer: Observer, data: ReactiveData) {
    if(!observeList.length) {
        return false
    }
    nextTick(() => {
        for(let i = 0, len = observeList.length; i < len; i += 1) {
            if(!observeList[i] || !utils.indexExist(observeList[i].index)) {
                continue
            }
            const _el: HTMLElement | null = document.querySelector(`.fishUI-virtual-list_${data.componentID} li[data-key="${observeList[i].nanoid}"]`)

            if(!_el) {
                continue 
            }
            // make sure unobserve before observe
            observer.resizeObserver.unobserve(_el)
            observer.intersectionObserver.unobserve(_el)
            observer.resizeObserver.observe(_el)
            observer.intersectionObserver.observe(_el)
        }
    })
}

function unobserve(unobserveList: ItemProps[], observer: Observer, data: ReactiveData) {
    if(!unobserveList.length) {
        return false
    }
    for(let i = 0, len = unobserveList.length; i < len; i += 1) {
        if(!unobserveList[i] || !utils.indexExist(unobserveList[i].index)) {
            continue
        }
        const _el: HTMLElement | null = document.querySelector(`.fishUI-virtual-list_${data.componentID} li[data-key="${unobserveList[i].nanoid}"]`)

        if(!_el) {
            continue 
        }
        observer.resizeObserver.unobserve(_el)
        observer.intersectionObserver.unobserve(_el)
    }
}

export default {
    observe,
    unobserve
}