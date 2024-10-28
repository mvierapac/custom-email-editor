import { createApp } from 'vue'
import './style.css'
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import App from './App.vue'

createApp(App)
.use( CkeditorPlugin )
.mount( '#app' );
