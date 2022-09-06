import {App, Plugin} from 'vue'
import VirtualListComponent from './index.vue'
import { VirtualScrollExpose } from './index.d'

const VirtualList: Plugin =  {
    install: (app: App) => {
        app.component('VirtualList', VirtualListComponent)
    }
}

export default VirtualList
export type VirtualExpose = VirtualScrollExpose