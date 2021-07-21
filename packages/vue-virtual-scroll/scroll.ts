import { cloneDeep } from 'lodash'
interface DataSource {
    [key: string]: any;
    transformY: number;
}
export function getScrollHeight(el: HTMLElement):number {
    return el.scrollTop
}


export function getScrollItemIndex(dataSource: DataSource[], direction: string = 'down', transformY:number):number {
    let _data = cloneDeep(dataSource)
    let _dataLength = _data.length
    let _index: number = 0

    for(let i = 0; i < _dataLength; i++) {
        if(direction === 'up') {
            if(_data[i].transformY < transformY && _data[i+1].transformY > transformY) {
                _index = i
                break
            }
        }
        if(direction === 'down') {
            if(_data[i].transformY > transformY) {
                _index = i
                break
            }
        }
    }

    return _index
}


