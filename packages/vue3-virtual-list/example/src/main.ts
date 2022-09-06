import { createApp } from 'vue'
import './normalize.css'
import '@vb_he/vue-virtual-scroll/dist/style.css'
import App from './App.vue'
import VirtualList from '@vb_he/vue-virtual-scroll'
import router from './router'

createApp(App).use(VirtualList).use(router).mount('#app')
