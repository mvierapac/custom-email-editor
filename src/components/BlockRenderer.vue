<template>
    <div 
      class="block-wrapper"
      v-bind:data-block-id="content.dataBlockId"
      :style="wrapperStyles"
      @click="handleBlockClick"
    >
      <component
        :is="getComponentType(content[0].type)"
        :attributes="content[0].attributes"
        @edit-block="handleEditBlock"
      />
    </div>
  </template>
  
  <script>
  import ButtonBlock from './ButtonBlock.vue';
//   import TextBlock from './TextBlock.vue';
  
  export default {
    props: {
      content: Object
    },
    components: {
      ButtonBlock,
      // TextBlock
    },
    computed: {
      wrapperStyles() {
        const padding = this.content.wrapper?.padding || { top: 0, right: 0, bottom: 0, left: 0 };
        return {
          paddingTop: `${padding.top}px`,
          paddingRight: `${padding.right}px`,
          paddingBottom: `${padding.bottom}px`,
          paddingLeft: `${padding.left}px`
        };
      }
    },
    methods: {
      getComponentType(type) {
        switch (type) {
          case 'button':
            return 'ButtonBlock';
          case 'text':
            return 'TextBlock';
          default:
            return 'div'; // Fallback to a div if the type is unknown
        }
      },
      handleEditBlock(updatedAttributes) {
        this.$emit('edit-block', updatedAttributes);
      }
    }
  };
  </script>

  <style scoped>
  .block-wrapper {
    display: inline-block; /* Ajusta el tamaño del wrapper al contenido */
    max-width: 100%; /* Limita el ancho si es necesario */
    text-align: center; /* Centra el contenido dentro del wrapper */
  }
  </style>
  