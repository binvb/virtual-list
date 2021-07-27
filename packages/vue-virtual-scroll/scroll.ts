interface DataSource {
    [key: string]: any;
    transformY: number;
}
export function getScrollHeight(el: HTMLElement):number {
    return el.scrollTop
}


export function getScrollItemIndex(dataSource: DataSource[], direction: string = 'down', transformY:number, startIndex: number):number {
    // dataSource may change by last or last... render #TODO
    let _dataLength = dataSource.length
    let _index: number = 0

    if(direction === 'down') {
        for(let i = startIndex; i < _dataLength; i++) {
            if(dataSource[i].transformY < transformY && dataSource[i+1].transformY > transformY) {
                _index = i
                break
            }
        }       
    }
    if(direction === 'up') {
        for(let i = startIndex; i >= 0; i--) {
            if(dataSource[i].transformY < transformY) {
                _index = i
                break
            }
        }
    }

    return _index
}

export function getCurrentTopItemIndex(dataSource: DataSource[], scrollTop: number):number {
    let _dataLength = dataSource.length
    let _index: number = 0

    for(let i = 0; i < _dataLength; i++) {
        if(dataSource[i].transformY <= scrollTop && dataSource[i+1].transformY > scrollTop) {
            _index = i
            break
        }
    }  
    
    return _index
}

