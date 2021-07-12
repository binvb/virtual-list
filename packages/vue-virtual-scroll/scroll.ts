import { cloneDeep } from 'lodash'
interface DataSource {
    [key: string]: any;
    transformY: number;
}
export function getScrollHeight(el: HTMLElement):number {
    return el.scrollTop
}


export function getScrollItemIndex(dataSource: DataSource[], direction: 'up' | 'down', scrollTop:number):number {
    let _data = cloneDeep(dataSource)
    let _index: number = 0

    _data.reduce((pre, current, index, arr) => {
        let _distance = current.transformY - scrollTop

        if((direction === 'down' && _distance > 0) || (direction === 'up' && _distance < 0)) {
            _index  = index - 1
            arr.splice(1)
        }
        return current
    })

    return _index
}

export function getCurrentScrollTopItem() {

}