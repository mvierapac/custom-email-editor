<template>
    <a :href="attributes.href"  class="button-link" :style="computedStyles">{{ attributes.text }}</a>
  </template>
  
  <script>
  export default {
    props: {
      attributes: Object
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
}

  </style>
  