import { createApp } from 'vue'
import App from './App.vue'
import router from '@/router'
import { NavBar, Popup, Button, Icon, Popover, Form, Field, CellGroup, Loading } from 'vant'
import Vue3TouchEvents from 'vue3-touch-events'
import './styles/index.scss';
import 'vant/es/notify/style'
import store from './store'
import { registerStore } from './js/api'

router.store = store
registerStore(store)
const app = createApp(App)
app.use(router)

app.use(NavBar)
app.use(Popup)
app.use(Button)
app.use(Icon)
app.use(Popover)
app.use(Form)
app.use(Field)
app.use(CellGroup)
app.use(Loading)

app.use(Vue3TouchEvents, {
    dragFrequency: 10
})
app.use(store)
app.mount('#app')