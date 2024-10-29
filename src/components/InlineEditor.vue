<template>
    <ckeditor
      v-if="isLayoutReady"
      :editor="editor"
      v-model="content"
      :config="config"
      @input="emitContent"
    ></ckeditor>
  </template>
  
  <script>
  import { InlineEditor } from 'ckeditor5'
  import 'ckeditor5/ckeditor5.css'
  import { ckeditorConfig, colors } from '../constans'
  
  export default {
    props: ['initialContent'],
    data () {
      return {
        isLayoutReady: true,
        editor: InlineEditor,
        content: this.initialContent || '',
        colors: colors,
        config: ckeditorConfig
      }
    },
    mounted () {
        this.config = ckeditorConfig
        this.isLayoutReady = true
    },
    watch: {
      initialContent (newValue) {
        this.content = newValue
      }
    },
    methods: {
      emitContent () {
        this.$emit('updateContent', this.content)
      },
    }
  }
  </script>
  
  <style scoped>
  .ck-editor__editable_inline {
    min-height: 100px;
    outline: none; /* Quita el borde azul cuando está en modo inline */
  }
  </style>
  