<template>
  <div class="block-wrapper" 
    :data-block-id="block.blockId"
    :style="{ 
      'padding-top': block.properties.containerPadding.top + 'px',
      'padding-right': block.properties.containerPadding.right + 'px',
      'padding-bottom': block.properties.containerPadding.bottom + 'px',
      'padding-left': block.properties.containerPadding.left + 'px',
    }"
    @click="selectBlock"
  >
    <button v-if="block.type === 'button'"
            :style="{ 
              backgroundColor: block.properties.backgroundColor,
              color: block.properties.color,
              padding: block.properties.padding,
              borderRadius: block.properties.borderRadius,
              border: 'none'
            }">
      <a :href=block.properties.href :style="{color:'white'}">{{ block.properties.text }}</a>
    </button>

    <p v-else-if="block.type === 'text'"
         v-html="block.properties.text" 
         class="no-margin"
         :class="block.blockId"
         :style="{ 
         fontSize: block.properties.fontSize,
         color: block.properties.color
         }">
    </p>

        <!-- Renderizado del bloque de imagen -->
        <img v-else-if="block.type === 'image'"
          :src="block.properties.src"
          :alt="block.properties.alt || 'Imagen de ejemplo'"
          :href="block.properties.href"
          :style="{ width: block.properties.width, height: block.properties.height, display: 'block' }" 
        />
    <!-- Puedes añadir otros tipos de bloques aquí -->
  </div>
</template>

<script>
export default {
  props: {
    block: Object
  },
  methods: {
    selectBlock() {
      this.$emit('block-selected', this.block.blockId);
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;

}
.block-wrapper {
  width: 100%;
  max-width: 600px;
  display: block;
  box-sizing: border-box;
  outline: none;
  padding: 10px;
}

.no-margin {
  margin: 0;
}
</style>
