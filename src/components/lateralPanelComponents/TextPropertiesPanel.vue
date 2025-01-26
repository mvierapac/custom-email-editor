<template>
    <div class="properties-panel lateral-panel-section-padding sticky-panel">
      <p class="properties-title">{{ $t('EDITOR.TEXT_PROPERTIES') }}</p>

      <!-- Line Height -->
      <div class="property-wrapper">
          <p class="property-title">{{ $t('EDITOR.LINE_HEIGHT') }}</p>
          <div class="padding-controls">
              <div class="control-wrapper">
                  <input type="number" v-model="localLineHeight" @input="updateLocalLineHeight()" min="0" class="padding-input" />
                  <span class="unit">px</span>
                  <button @click="decreaseLocalLineHeight()" class="adjust-button">−</button>
                  <button @click="increaseLocalLineHeight()" class="adjust-button">+</button>
              </div>
          </div>
       </div>       
      <!-- Padding control -->
      <div class="property-wrapper">
          <p class="property-title">{{ $t('EDITOR.CONTAINER_PADDING') }}</p>
          <div class="padding-controls">
            <div class="padding-control" v-for="side in ['Top', 'Right', 'Bottom', 'Left']" :key="side">
                <label>{{ side }}</label>
                <div class="control-wrapper">
                    <input type="number" v-model="containerPadding[side.toLowerCase()]" @input="updateLocalPadding(side)" min="0" class="padding-input" />
                    <span class="unit">px</span>
                    <button @click="decreaseLocalPadding(side)" class="adjust-button">−</button>
                    <button @click="increaseLocalPadding(side)" class="adjust-button">+</button>
                </div>
            </div>
          </div>
       </div>      
    </div>
  </template>
  
  <script>
  export default {
    props: {
      containerPadding: {
        type: Object,
        required: true
      },
      lineHeight: {
        type: Number,
        required: true,
        default: 16
      }
    },
    data() {
      return {
        localContainerPadding: { ...this.containerPadding },
        localLineHeight: this.lineHeight
      };
    },
    methods: {
      increaseLocalPadding (side) {
        this.localContainerPadding[side.toLowerCase()]++
        this.updateLocalContainerPadding(side);
      },
      decreaseLocalPadding (side) {
        if (this.localContainerPadding[side.toLowerCase()] > 0) {
          this.localContainerPadding[side.toLowerCase()]--
          this.updateLocalContainerPadding(side);
        }
      },
      updateLocalContainerPadding(side) {
        // Emitimos el evento con el padding actualizado para el lado especificado
        this.$emit('update-container-padding', { side: side.toLowerCase(), value: this.localContainerPadding[side.toLowerCase()] });
      },
      increaseLocalLineHeight () {
        this.localLineHeight++
        this.updateLocalLineHeight()
      },
      decreaseLocalLineHeight () {
        this.localLineHeight--
        this.updateLocalLineHeight()
      },
      updateLocalLineHeight() {
        this.$emit('update-line-height', this.localLineHeight);
      },
    },
    watch: {
      containerPadding(newPadding) {
        this.localContainerPadding = { ...newPadding };
      },
      lineHeight(newVal) {
        this.localLineHeight = newVal;
      },
    }
  };
  </script>
  
  <style scoped>
  </style>
  