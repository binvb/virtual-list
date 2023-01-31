import { SourceData} from './index.d'

function resetSourceDataBeforeLocate(sourceData: SourceData[], endIndex:number) {
    for(let i = 0; i <= endIndex; i += 1) {
        if(!sourceData[i]) {
            return
        }
        if(i === 0) {
            sourceData[i].transformY = 0
        } else {
            sourceData[i].transformY = sourceData[i - 1].transformY! + sourceData[i - 1].offsetHeight!
        }
    }

    return sourceData
}

onmessage = () => {
    console.log(`这里收到数据`)
}
window.addEventListener('message', (e) => {
    console.log(`接收到数据, ${e}`)
})