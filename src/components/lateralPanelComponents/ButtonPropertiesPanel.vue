<template>
    <div class="properties-panel">
      <div class="input-container">
        <label for="url-input">URL</label>
        <input
          type="text"
          id="url-input"
          v-model="localButtonLink"
          @blur="updateHref"
          placeholder="https://example.com">
      </div>
      <div class="input-container">
        <label for="button-text">Texto</label>
        <input
          type="text"
          id="button-text"
          v-model="localButtonText"
          @blur="updateText"
          placeholder="Texto">
      </div>
      <div class="align-buttons">
        <button class="align-button" @click="updateAlignment('left')">Izda</button>
        <button class="align-button" @click="updateAlignment('center')">Centro</button>
        <button class="align-button" @click="updateAlignment('right')">Drcha</button>
      </div>

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
      buttonLink: {
        type: String,
        required: true
      },
      buttonText: {
        type: String,
        required: true
      },
      containerPadding: {
        type: Object,
        required: true
      }
    },
    data() {
      return {
        localButtonLink: this.buttonLink,
        localButtonText: this.buttonText,
        localContainerPadding: { ...this.containerPadding },
      };
    },
    methods: {
      updateHref() {
        this.$emit('update-button-href', this.localButtonLink);
      },
      updateText() {
        this.$emit('update-button-text', this.localButtonText);
      },
      updateAlignment(alignment) {
        this.$emit('update-button-alignment', alignment);
      },
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
      buttonLink(newVal) {
        this.localButtonLink = newVal;
      },
      buttonText(newVal) {
        this.localButtonText = newVal;
      },
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
  .align-buttons {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.align-button {
  background-color: #e4c77be7;
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
}
  </style>
  