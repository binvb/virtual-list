import { Observer, ReactiveData } from './index.d'
import utils from './utils'

function observe(observeList: any[], observer: Observer, data: ReactiveData) {
    if(!observeList.length) {
        return false
    }
    setTimeout(() => {
        console.log(`订阅: ${observeList[0].index}-${observeList[observeList.length - 1].index}`)
        for(let i = 0, len = observeList.length; i < len; i += 1) {
            if(!observeList[i] || !utils.indexExist(observeList[i].index)) {
                console.log(`警告，没有订阅到: ${JSON.stringify(observeList[i])}`)
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
    console.log(`退订: ${unobserveList[0].index}-${unobserveList[unobserveList.length - 1].index}`)
    for(let i = 0, len = unobserveList.length; i < len; i += 1) {
        if(!unobserveList[i] || !utils.indexExist(unobserveList[i].index)) {
            console.log(`警告，没有退订到: ${JSON.stringify(unobserveList[i])}`)
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