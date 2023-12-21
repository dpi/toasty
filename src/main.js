import './assets/main.css'
import './style.css'

import timeago from 'vue-timeago3'
import { createApp } from 'vue'
import App from './App.vue'

const timeagoOptions = {
  converterOptions: {
    includeSeconds: false
  }
}

createApp(App)
  .use(timeago, timeagoOptions)
  .provide('pusher-configuration', window.PusherConfiguration)
  .mount('.toasty-toaster')
