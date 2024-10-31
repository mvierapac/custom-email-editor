<template>
    <div class="column-properties-panel">
      <p class="column-number">Propiedades de la columna {{ columnIndex + 1 }}</p>
      <div class="color-picker">
        <label class="property-title">Background Color</label>
        <div
          class="color-preview"
          :style="{ backgroundColor: columnBackgroundColor }"
          @click="triggerColorPicker"
        ></div>
        <input
          type="color"
          v-model="localBackgroundColor"
          @input="updateBackgroundColor"
          ref="colorInput"
          style="visibility: hidden;"
        >
      </div>
  
      <!-- Padding control -->
      <p class="property-title">Padding</p>
  
      <div class="padding-controls">
        <div class="padding-control" v-for="side in ['Top', 'Right', 'Bottom', 'Left']" :key="side">
            <label>{{ side }}</label>
            <div class="control-wrapper">
                <input type="number" v-model="localPadding[side.toLowerCase()]" @input="updatePadding(side)" min="0" class="padding-input" />
                <span class="unit">px</span>
                <button @click="decreasePadding(side)" class="adjust-button">−</button>
                <button @click="increasePadding(side)" class="adjust-button">+</button>
            </div>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      columnBackgroundColor: {
        type: String,
        required: true
      },
      columnIndex: {
        type: Number,
        required: true
      },
      columnPadding: {
        type: Object,
        required: true
      }
    },
    data () {
      return {
        localBackgroundColor: this.columnBackgroundColor,
        localPadding: { ...this.columnPadding }
      }
    },
    methods: {
      triggerColorPicker () {
        this.$refs.colorInput.click()
      },
      updateBackgroundColor () {
        this.$emit('update-background-color', this.localBackgroundColor)
      },
      increasePadding (side) {
        this.localPadding[side.toLowerCase()]++
        this.updatePadding(side);
      },
      decreasePadding (side) {
        if (this.localPadding[side.toLowerCase()] > 0) {
          this.localPadding[side.toLowerCase()]--
          this.updatePadding(side);
        }
      },
      updatePadding(side) {
        // Emitimos el evento con el padding actualizado para el lado especificado
        this.$emit('update-padding', { side: side.toLowerCase(), value: this.localPadding[side.toLowerCase()] });
      }
    },
    watch: {
      columnBackgroundColor (newColor) {
        this.localBackgroundColor = newColor
      },
      columnPadding(newPadding) {
        this.localPadding = { ...newPadding };
      }
    }
  }
  </script>
  
  <style scoped>
  
    .property-title {
        font-size: 14px;
        font-weight: bold;
        text-align: left;
    }
  .color-picker {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: 8px;
  }
  
  .color-picker label {
    font-size: 14px;
    font-weight: bold;
  }
  
  .color-preview {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid #ddd;
    cursor: pointer;
  }
  
  .column-number {
    margin-top: 0;
    font-size: 14px;
    text-align: left;
  }
  
  .padding-controls {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  }
  
  .padding-control {
  display: flex;
  flex-direction: column;
  }
  
  label {
  font-weight: bold;
  margin-bottom: 4px;
  color: #333;
  }
  
  .padding-controls {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  }
  
  .padding-control {
  display: flex;
  flex-direction: column;
  align-items: center;
  }

  .padding-control label {
    font-size: 12px;
  }
  
  .control-wrapper {
  display: flex;
  align-items: center;
  border: 1px solid #ddd;
  border-radius: 4px;
  overflow: hidden;
  height: 32px; /* Asegura que todos tengan la misma altura */
  }
  
  .padding-input {
  width: 30px;
  border: none;
  text-align: center;
  height: 100%; /* Coincide con la altura del contenedor */
  padding: 0;
  box-sizing: border-box;
  -moz-appearance: textfield; /* Elimina las flechas de número en Firefox */
  }
  
  .padding-input::-webkit-outer-spin-button,
  .padding-input::-webkit-inner-spin-button {
  -webkit-appearance: none; /* Elimina las flechas de número en Chrome */
  margin: 0;
  }
  
  .unit {
  background-color: #f0f0f0;
  padding: 0 8px;
  height: 100%; /* Coincide con la altura del contenedor */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  color: #333;
  }
  
  .adjust-button {
  border: none;
  background-color: #f9f9f9;
  width: 24px;
  height: 100%; /* Coincide con la altura del contenedor */
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  cursor: pointer;
  }
  
  .adjust-button:hover {
  background-color: #e0e0e0;
  }
  
  /* Ocultar las flechas en los navegadores de WebKit (Chrome, Safari, etc.) */
  .padding-input::-webkit-inner-spin-button,
  .padding-input::-webkit-outer-spin-button {
  -webkit-appearance: none;
  margin: 0;
  }
  </style>
  