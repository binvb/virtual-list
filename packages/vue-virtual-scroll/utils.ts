import { cloneDeep } from 'lodash'

interface DataSource {
    [key: string]: any;
    transformY: number;
}

export function addTombStoneProperty(items: any[], offsetHeight: any) {
    let _result = cloneDeep(items)

    _result.map(element => {
        return Object.assign(element, {isTombstone: true, offsetHeight})
    })
    
    return _result
}

export async function sleep(period:number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, period)
    })
}

export function addTransformProperty(data:DataSource[], transformY: number, offsetHeight: number, initDataNum: number) {
    let _data = cloneDeep(data)

    _data.map((element, index) => {
        element.index = index
        element.transformY = index * transformY
        element.offsetHeight = offsetHeight
        element.isTombstone = true
        if(index < initDataNum) {
            element.isVisible = true
        }
    })

    return _data
}

export function replaceArrayFragment(data: any[], replaceData: any[], startIndex: number, endIndex: number) {
    for(let i = startIndex; i < endIndex + 1; i++) {
        data[i] = replaceData[i]
    }
}