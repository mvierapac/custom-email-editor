<template>
  <div class="block-wrapper"
    :class="{'selected-block': isSelected}"
    :data-block-id="block.blockId"
    :style="{ 
      'padding-top': block.properties.containerPadding.top + 'px',
      'padding-right': block.properties.containerPadding.right + 'px',
      'padding-bottom': block.properties.containerPadding.bottom + 'px',
      'padding-left': block.properties.containerPadding.left + 'px',
      'text-align': block.properties.aligment || 'center'
    }"
    @click="selectBlock"
  >

    <!-- Indicador de arrastre solo visible en bloques seleccionados -->
    <!-- <div
      v-if="isSelected"
      class="drag-handle-block"
      @dragstart="handleDragStart(block.blockId)"
      draggable="true"
    >
      <span class="drag-icon">
        <i class="fas fa-arrows-alt"></i>
      </span>
    </div> -->
    <!-- Pop-up de acciones -->
    <div v-if="isSelected" class="block-action-panel">
      <button 
        v-if="showUpBtn" 
        class="block-action-icon" 
        @click.stop="emitUpBlock"
      >
        <v-icon>mdi-chevron-up</v-icon>
      </button>
      <button 
        v-if="showDownBtn" 
        class="block-action-icon" 
        @click.stop="emitDownBlock"
      >
        <v-icon>mdi-chevron-down</v-icon>
      </button>
      <button class="block-action-icon delete-icon" @click.stop="emitDeleteBlock">
        🗑️
      </button>
      <button class="block-action-icon copy-icon" @click.stop="emitDuplicateBlock">
        📄
      </button>
    </div>
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

    <p v-else-if="block.type === 'texticon'"
         class="no-margin"
         :class="block.blockId"
         :style="{ 
         fontSize: block.properties.fontSize,
         color: block.properties.color
         }">
        <img 
          :src="block.properties.iconSrc" 
          :width="block.properties.iconSize + 'px'" 
          alt="Icono" 
          style="display: inline-block; vertical-align: middle;" 
        />
        <span 
          :style="{ 
            fontSize: block.properties.fontSize,
            color: block.properties.color 
          }"
          v-html="block.properties.text"
        ></span>
    </p>

        <!-- Renderizado del bloque de imagen -->
        <img v-else-if="block.type === 'image'"
          :src="block.properties.src"
          :alt="block.properties.alt || 'Imagen de ejemplo'"
          :href="block.properties.href"
          :style="{ width: block.properties.width + '%', height: block.properties.height, display: 'inline-block', 'vertical-align': 'middle' }" 
        />
    <!-- Puedes añadir otros tipos de bloques aquí -->
  </div>
</template>

<script>
export default {
  props: {
    block: Object,
    isSelected: Boolean,
    showUpBtn: Boolean,
    showDownBtn: Boolean
  },
  data() {
    return {
      dragStartAllowed: false,
    };
  },
  methods: {
    selectBlock() {
      this.$emit('block-selected', this.block.blockId);
    },
    emitDeleteBlock() {
      this.$emit('delete-block', this.block.blockId);
    },
    emitDuplicateBlock() {
      this.$emit('duplicate-block', this.block.blockId);
    },
    emitDownBlock() {
      this.$emit('down-block');
    },
    emitUpBlock() {
      this.$emit('up-block');
    }
  }
};
</script>

<style scoped>
a {
  text-decoration: none;

}
.block-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
  display: block;
  box-sizing: border-box;
  outline: none;
  padding: 10px;
}

.selected-block {
  outline: 2px solid #007bff;
  outline-offset: -1px;
  box-sizing: border-box;
}

.no-margin {
  margin: 0;
}

.no-margin > p {
  margin: 0;
}

.block-action-panel {
  z-index: 21;
  position: absolute;
  bottom: 0;
  right: 0;
  transform: translateY(100%);
  display: flex;
  gap: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px;
}

.block-action-icon {
  font-size: 16px;
  cursor: pointer;
  background: transparent;
  border: none;
}

.block-action-icon:hover {
  color: #007bff;
}
</style>
