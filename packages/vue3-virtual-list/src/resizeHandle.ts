import { nextTick } from 'vue'
import { ajustScrollPosition, scrollToBottom } from './scrollInstance'
import { ReactiveData } from "./index.d"
import utils from './utils'

function resizeHandle(data:ReactiveData) {
    const { currentData, sourceData, componentID } = data
    const len = currentData.length
    if(!len) {
        return
    }
    const scrollTop = utils.getScrollTop(data)
    const currentViewPortTopIndex = utils.getCurrentTopIndex(currentData, scrollTop)
    const viewPortOffsetHeight = utils.getViewPortOffsetHeight(data)
    const innerOffsetHeight = utils.getListHeight(data)

    for(let i = 0; i < len; i += 1) {
        const _pre = sourceData[currentData[i].index! - 1]
        const _elOffsetHeight = (document.querySelector(`.fishUI-virtual-list_${componentID} li[data-index="${currentData[i].index}"]`) as HTMLElement).offsetHeight

        if(currentData[i].offsetHeight !==  _elOffsetHeight) {
            // 1、resize item above current scrollTop
            // 2、if chating(bottom position), need scroll to bottom(but here's allready render, it's hard to get before status, here use last item transformY to compare)
            if (scrollTop !== 0 && currentViewPortTopIndex! > currentData[i].index) {
                ajustScrollPosition(_elOffsetHeight - currentData[i].offsetHeight, data)
            }
            // // if bottom
            if(scrollTop + viewPortOffsetHeight >= innerOffsetHeight) {
                nextTick(() => {
                    scrollToBottom(data)
                })
            }
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


export default resizeHandle