import observeHandle from './observeHandle'
import { Observer, ReactiveData } from "./index.d"

interface PatchResult {
    before: number // need to fill scroll item number before
    after: number // need to fill scroll item number after
}

function interAction(currentIndex: number, perPageItemNum: number, data: ReactiveData, observer: Observer) {
    let {sourceData, currentData} = data
    let screenNum = perPageItemNum
    let topIndex = currentData[0].index!
    let bottomIndex = currentData[currentData.length - 1].index!
    let patchResult = patch(currentIndex, screenNum, topIndex, bottomIndex)

    if(patchResult.before > 0) {
        let _start = topIndex - patchResult.before
        let _end = topIndex
        let _data = sourceData.slice(_start > 0 ? _start : 0, _end)

        if(_data.length > 2 * screenNum) {
            _data.splice(0, 2 * screenNum)
        }
        currentData = _data.concat(currentData)
        observeHandle.observe(_data, observer, data)
    } else {
        observeHandle.unobserve(currentData.splice(0, Math.abs(patchResult.before)), observer, data)
    }
    // make sure after has more than full screens
    if(patchResult.after > 0) {
        let _start = bottomIndex
        let _end = bottomIndex + patchResult.after
        let _data = sourceData.slice(_start + 1, _end + 1)

        if(_data.length > screenNum) {
            _data = _data.slice(_data.length - 2 * screenNum, _data.length)
        }
        currentData = currentData.concat(_data) 
        observeHandle.observe(_data, observer, data)
    } else {
        observeHandle.unobserve(currentData.splice(2 * screenNum, 100000000000), observer, data)
    }
    return currentData
}

function patch(currentIndex: number, screenNum: number, topIndex: number, bottomIndex: number) {
    let result: PatchResult = {
        before: 0,
        after: 0
    }

    result.before = screenNum - (currentIndex - topIndex)
    result.after = screenNum - (bottomIndex - currentIndex)

    return result
}

export default  {
    interAction,
    observeHandle
}