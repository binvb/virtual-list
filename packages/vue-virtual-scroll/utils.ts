import { cloneDeep } from 'lodash'

interface DataSource {
    [key: string]: any;
    transformY: number;
}

export async function sleep(period:number): Promise<void> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve()
        }, period)
    })
}

export function addTransformProperty(data:DataSource[], transformY: number, offsetHeight: number, initDataNum: number) {
    data.map((element, index) => {
        element.index = index
        element.transformY = index * transformY
        element.offsetHeight = offsetHeight
        element.isTombstone = true
        if(index < initDataNum) {
            element.isVisible = true
        }
    })
}

export function replaceArrayFragment(data: any[], replaceData: any[], startIndex: number, endIndex: number) {
    for(let i = startIndex; i < endIndex + 1; i++) {
        data[i] = replaceData[i]
    }
}