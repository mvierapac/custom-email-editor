<template>
    <div class="properties-panel">

      <!-- Padding control -->
      <div class="property-wrapper">
          <p class="property-title">Padding del contenedor</p>
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
      }
    },
    data() {
      return {
        localContainerPadding: { ...this.containerPadding },
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
    },
    watch: {
      containerPadding(newPadding) {
        this.localContainerPadding = { ...newPadding };
      },
    }
  };
  </script>
  
  <style scoped>
  .properties-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }
  </style>
  