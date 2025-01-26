
import { createI18n } from "vue-i18n";

// Importacion de ficheros para internacionalizacion
import en from './en.json'
import es from './es.json'

var ln = window.navigator.language.slice(0, 2) || navigator.browserLanguage.slice(0, 2)

const locale = ln

// Introduccion de los ficheros con la variables de idiomas
const messages = {
  en: en,
  es: es
}

// configure i18n
const i18n = createI18n({
  locale: locale,
  fallbackLocale: "es",
  messages: messages
});

export default i18n

// WEBPACK FOOTER //
// ./src/lang/lang.js
