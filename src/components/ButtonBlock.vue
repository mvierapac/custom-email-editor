<template>
    <div :data-block-id="dataBlockId">
      <a :href="attributes.href"  class="button-link" :style="computedStyles">{{ attributes.text }}</a>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      attributes: Object,
      dataBlockId: String
    },
    computed: {
      computedStyles() {
        const { backgroundColor, color, padding, borderRadius } = this.attributes;
        return { backgroundColor, color, padding, borderRadius };
      }
    }
  };
  </script>

  <style scoped>

.button-link {
  color: white;
  text-decoration: none;
  border: none;
}

  </style>
  