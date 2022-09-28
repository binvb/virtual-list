## FEATURE
1、async component render;  
2、locate/update/delete/add specify location;  
3、scroll loading;  
4、chat mode(keep bottom position);  
5、loading mode(scroll loading);  

[demo](https://binvb.github.io/vb.github.io/#/normal)
## USAGE
1、install;  
```
npm install --save @vb_he/vue-virtual-scroll
```

2、import;  
```
import VirtualList from '@vb_he/vue-virtual-scroll'
import '@vb_he/vue-virtual-scroll/dist/style.css'

// global registry
createApp(App).use(VirtualList).mount('#app')
```

3、use in vue component
```
<div style="width: 800px;height: 1000px;">
    <Virtual-list
    ref="virtualScroll"
    :scrollItem="StaticItem"
    :height="42"
    :perPageItemNum="20"
    ></Virtual-list>
</div>
```

### props
|   key   | default value | required | description |
|  ----  | -------------  | -------- | ----------- |
| scrollItem | null | true | scroll item inside component |
| perPageItemNum  | 20       |  true    | at less display area number, normaly component keep render 2 * perPageItemNum item |
| height  | 100  | true    | item size(height),for better performance |
| direction | 'down' | false | 'up'/'down', need to set 'up' in chat mode |
| loadingOptions | null | false | see under |


loadingOptions(loading mode or chat mode): 
| key | default value | required | description |
| --- | ------------- | -------- | ----------- |
| loadingFn | null | true | need to return Promise<any[]> |
| loadingComponent | loading.io style | false | can replace default loading component |
| nomoreData | false | true | set true if no more data |
| nomoreDataText | 'no more data' | false | set no more data text |

### expose method 
you may need to understand [expose](https://vuejs.org/api/options-state.html#expose)

type declaration
```
export interface VirtualScrollExpose {
  locate: (index: number) => void 
  del: (index: number | number[]) => void
  add: (index: number, insertData: any[]) => void
  update: (index: number, data: any) => void
  setSourceData: (data: any[]) => void
  getData: () => ItemProps[],
  getCurrentViewPortData: () => ItemProps[]
}
```

basically, you can only use all this methods to change the view, e.g.
```
<script setup lang="ts">
import { onMounted, ref, reactive } from 'vue'
import { VirtualExpose } from '@vb_he/vue-virtual-scroll'
import StaticItem from './../components/static.component.vue'
import { getMessage } from "./../mock"
const virtualScroll = ref<VirtualExpose>()
const data = reactive({
    locateNum: 0,
    updateNum: 0,
    delNum: 0,
    addNum: 0,
    size: 100000
})
onMounted(async() => {
    virtualScroll.value!.setSourceData(await loadData())
})
function loadData(): Promise<any[]> {
    return new Promise((resolve) => {
    setTimeout(() => {
        resolve(getMessage(data.size))
    },1000)
    })
}
function locate() {
    virtualScroll.value?.locate(data.locateNum)
}
async function update() {
    const newData = await getMessage(1)
    virtualScroll.value?.update(data.updateNum, newData[0])
}
function del() {
    virtualScroll.value?.del(data.delNum)
}
async function add() {
    const newData = await getMessage(1)
    virtualScroll.value?.add(data.addNum, newData)
}
async function reset() {
    virtualScroll.value!.setSourceData(await loadData())
}
</script>
<template>
    <div style="display: flex;">
    <div style="display:flex;flex-direction: column;flex: 0 0 250px;margin-left: 10px">
        <div style="display:flex;justify-content: space-between;margin-top: 20px">
        <input v-model="data.locateNum" type="number" data-testid="locateNum" placeholder="index" />
        <button @click="locate">locate</button>
        </div>
        <div style="display:flex;justify-content: space-between;margin-top: 20px">
        <input v-model="data.updateNum" type="number" placeholder="index" />
        <button @click="update">update</button>
        </div>
        <div style="display:flex;justify-content: space-between;margin-top: 20px">
        <input v-model="data.delNum" type="number" placeholder="index" />
        <button @click="del">del</button>
        </div>
        <div style="display:flex;justify-content: space-between;margin-top: 20px">
        <input v-model="data.addNum" type="number" placeholder="index" />
        <button @click="add">add</button>
        </div>
        <div style="display:flex;justify-content: space-between;margin-top: 20px">
        <input v-model="data.size" type="number" placeholder="index" />
        <button @click="reset">reset</button>
        </div>
    </div>
    <div style="width: 800px;height: 1000px;margin: 0 auto;border: 1px solid #000">
        <Virtual-list
        ref="virtualScroll"
        :perPageItemNum="40"
        :scrollItem="StaticItem"
        :height="42"
        ></Virtual-list>
    </div>
    </div>
</template>
```
