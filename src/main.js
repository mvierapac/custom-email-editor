import { createApp } from 'vue'
import './style.css'
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css';
import '@mdi/font/css/materialdesignicons.css';

// Vuetify
import 'vuetify/styles'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

const vuetify = createVuetify({
    components,
    directives,
  })

createApp(App)
.use( CkeditorPlugin )
.use(vuetify)
.mount( '#app' );
