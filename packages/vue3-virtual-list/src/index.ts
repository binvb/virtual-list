import {App, Plugin} from 'vue'
import VirtualListComponent from './index.vue'

const VirtualList: Plugin =  {
    install: (app: App) => {
        app.component('VirtualList', VirtualListComponent)
    }
}

export default VirtualList