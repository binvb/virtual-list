import { ajustAction } from './scrollInstance'
import { ReactiveData } from "./index.d"
import utils from './utils'
import throttle from 'lodash/throttle'

const ajustActionThrottle = throttle((data) => {
    ajustAction(data.locationPosition, data)
}, 100, {trailing: true, leading: false})
function resizeHandle(data:ReactiveData) {
    const { currentData, sourceData, componentID } = data
    const len = currentData.length

    if(!len) {
        return
    }
    const scrollTop = utils.getScrollTop(data)
    const correctLocateItem = data.currentData.find(item => item.transformY >= data.locationPosition) || data.currentData[data.currentData.length - 1]
    const ifBottomPosition = utils.ifBottomPosition(data)

    for(let i = 0; i < len; i += 1) {
        const _pre = sourceData[currentData[i].index! - 1]
        const _currentEl = document.querySelector(`.fishUI-virtual-list_${componentID} li[data-key="${currentData[i].nanoid}"]`) as HTMLElement
        if(!_currentEl) {
            continue
        }
        const _elOffsetHeight = _currentEl.offsetHeight

        if(currentData[i].offsetHeight !==  _elOffsetHeight) {
            let _offset = _elOffsetHeight - currentData[i].offsetHeight
            // if bottom, need to wait for listheight rendered
            // if above locate item resize need to be compenstion, exclude top position
            if(ifBottomPosition) {
                compensation(data, _offset)
                ajustActionThrottle(data)
            } else if (scrollTop !== 0 && correctLocateItem?.index > currentData[i].index && !data.userScrolling) {
                compensation(data, _offset)
                ajustAction(data.locationPosition, data)
            }
            data.listHeight += _offset
            currentData[i].offsetHeight = _elOffsetHeight
        }
        if(_pre) {
            let _elTransformY = _pre.offsetHeight! + _pre.transformY!

            if(currentData[i].transformY !== _elTransformY) {
                currentData[i].transformY = _elTransformY
            }
        }
    }
}

function compensation(data:ReactiveData, offset: number) {
    data.locationPosition += offset
    data.ajusting = true
}

export default resizeHandle