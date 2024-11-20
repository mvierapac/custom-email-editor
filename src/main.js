import { createApp } from 'vue'
import './style.css'
import { CkeditorPlugin } from '@ckeditor/ckeditor5-vue';
import App from './App.vue'
import '@fortawesome/fontawesome-free/css/all.css';

createApp(App)
.use( CkeditorPlugin )
.mount( '#app' );
