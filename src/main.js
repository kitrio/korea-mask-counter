import Vue from 'vue'
import './plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import L from 'leaflet'
import { LMap, LTileLayer, LMarker } from 'vue2-leaflet'
import 'leaflet/dist/leaflet.css'
Vue.config.productionTip = false
new Vue({
  L,
  LMap,
  LMarker,
  LTileLayer,
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
