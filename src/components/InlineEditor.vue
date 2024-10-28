<template>
    <ckeditor
      :editor="editor"
      v-model="content"
      :config="config"
      @input="emitContent"
    ></ckeditor>
  </template>
  
  <script>
  import { ClassicEditor, Alignment, Underline, Bold, Italic, Mention, Paragraph, Link, Font } from 'ckeditor5'
  import 'ckeditor5/ckeditor5.css'
  import { colors } from '../constans'
  
  export default {
    props: ['initialContent'],
    data () {
      return {
        editor: ClassicEditor,
        content: this.initialContent || '',
        colors: colors,
        config: {
          plugins: [Bold, Link, Italic, Underline, Mention, Paragraph, Alignment, Font],
          toolbar: [
            'fontsize', 'fontColor', 'fontBackgroundColor',
            '|',
            'alignment:left',
            'alignment:right',
            'alignment:center',
            'alignment:justify',
            '|',
            'bold', 'italic', 'strikethrough', 'underline',
            '|',
            'link'
          ],
          fontSize: {
            options: [
              { title: 9, model: '9px' },
              { title: 10, model: '10px' },
              { title: 11, model: '11px' },
              { title: 12, model: '12px' },
              { title: 13, model: '13px' },
              { title: 14, model: '14px' },
              { title: 15, model: '15px' },
              { title: 17, model: '17px' },
              { title: 20, model: '20px' }]
          },
          fontColor: {
            columns: 8,
            documentColors: colors.length,
            colors
          }
        }
      }
    },
    watch: {
      initialContent (newValue) {
        this.content = newValue
      }
    },
    methods: {
      emitContent () {
        this.$emit('updateContent', this.content)
      }
    }
  }
  </script>
  
  <style scoped>
  .ck-editor__editable_inline {
    min-height: 100px;
    outline: none; /* Quita el borde azul cuando está en modo inline */
  }
  </style>
  