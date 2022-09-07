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

    for(let i = 0; i < len; i += 1) {
        const _pre = sourceData[currentData[i].index! - 1]
        const _elOffsetHeight = (document.querySelector(`.fishUI-virtual-list_${componentID} li[data-index="${currentData[i].index}"]`) as HTMLElement).offsetHeight

        if(currentData[i].offsetHeight !==  _elOffsetHeight) {
            // resize item above current scrollTop, exclude top position && loading mode
            if (data.mode !== 'loading' && scrollTop !== 0 && currentViewPortTopIndex! > currentData[i].index) {
                ajustScrollPosition(_elOffsetHeight - currentData[i].offsetHeight, data)
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