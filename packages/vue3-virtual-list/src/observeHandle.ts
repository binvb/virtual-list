import { Observer, ReactiveData } from './index.d'
import utils from './utils'

function observe(observeList: any[], observer: Observer, data: ReactiveData) {
    if(!observeList.length) {
        return false
    }
    setTimeout(() => {
        for(let i = 0, len = observeList.length; i < len; i += 1) {
            if(!observeList[i] || !utils.indexExist(observeList[i].index)) {
                continue
            }
            let _el: HTMLElement | null = document.querySelector(`.fishUI-virtual-list_${data.componentID} li[data-key="${observeList[i].nanoid}"]`)

            if(!_el) {
                continue 
            }
            observer.resizeObserver.observe(_el)
            observer.intersectionObserver.observe(_el)
            _el = null
        }
    }, 0)
}

function unobserve(unobserveList: any[], observer: Observer, data: ReactiveData) {
    if(!unobserveList.length) {
        return false
    }
    for(let i = 0, len = unobserveList.length; i < len; i += 1) {
        if(!unobserveList[i] || !utils.indexExist(unobserveList[i].index)) {
            continue
        }
        let _el: HTMLElement | null = document.querySelector(`.fishUI-virtual-list_${data.componentID} li[data-key="${unobserveList[i].nanoid}"]`)

        if(!_el) {
            continue 
        }
        observer.resizeObserver.unobserve(_el)
        observer.intersectionObserver.unobserve(_el)
        _el = null
    }
}

export default {
    observe,
    unobserve
}