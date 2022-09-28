import * as VueRouter from 'vue-router'
import NormalPage from './pages/normal.vue'
import LoadingPage from './pages/loading.vue'
import ChatPage from './pages/chat.vue'
import StaticPage from './pages/static.vue'

const routes = [
    {
        default: true,
        name: 'Normal',
        path: '/normal',
        component: NormalPage
    },
    {
        path: '/loading',
        name: 'Loading',
        component: LoadingPage
    },
    {
        path: '/chat',
        name: 'Chat',
        component: ChatPage
    },
    {
        path: '/static',
        name: 'Static',
        component: StaticPage
    }
]
const router = VueRouter.createRouter({
    history: VueRouter.createWebHashHistory(),
    routes
})

export default router