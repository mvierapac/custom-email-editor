<template>
  <ckeditor v-if="isLayoutReady" :editor="editor" v-model="content" :config="config" @input="emitContent"></ckeditor>
</template>

<script>
import { ClassicEditor } from 'ckeditor5';
import 'ckeditor5/ckeditor5.css';
import { ckeditorConfig, colors } from '_editor/ckeditorConfig';

export default {
  props: ['initialContent', 'bgColor'],
  data() {
    return {
      isLayoutReady: true,
      editor: ClassicEditor,
      content: this.initialContent || '',
      colors: colors,
      config: ckeditorConfig,
    };
  },
  mounted() {
    this.config = ckeditorConfig;
    this.isLayoutReady = true;
    const style = document.createElement('style');
    style.innerHTML = `.ck.ck-content { background-color: ${this.bgColor} !important; }`;
    document.head.appendChild(style);
  },
  watch: {
    initialContent(newValue) {
      this.content = newValue;
    },
  },
  methods: {
    emitContent() {
      this.$emit('updateContent', this.content);
    },
  },
};
</script>

<style scoped>
.ck-editor__editable_inline {
  min-height: 100px;
  outline: none; /* Quita el borde azul cuando está en modo inline */
}

:deep(.ck.ck-editor__main > .ck-editor__editable) {
  background-color: var(--editor-bg) !important;
}

.ck.ck-editor__main > .ck-editor__editable {
  background-color: var(--editor-bg) !important;
}
</style>
