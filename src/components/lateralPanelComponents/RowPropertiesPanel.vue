<template>
  <section>
    <button class="collapsable-panel-button" @click="handleExpandBtn">
        <p>Propiedades de la fila</p>
        <i class="mdi mdi-chevron-up" v-if="expanded"></i>
        <i class="mdi mdi-chevron-down" v-else></i>
    </button>
    <div class="column-properties-panel" v-if="expanded">
      <div class="property-wrapper">
        <div class="color-picker">
          <label class="property-title">{{ $t('EDITOR.BG_COLOR') }}</label>
          <color-picker
            v-model="localBackgroundColor"
            @update:model-value="updateBackgroundColor()"
          ></color-picker>

        </div>
      </div>

      <!-- Padding control -->
      <div class="property-wrapper">
          <p class="property-title">{{ $t('EDITOR.PADDING') }}</p>
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

    </div>
  </section>
</template>

<script>

import { EDITOR_COLOR_PALETTE } from '@/constants.js'
import ColorPicker from '_editor/auxiliarComponents/ColorPicker.vue'

export default {
  props: {
    rowBackgroundColor: {
      type: String,
      required: true
    },
    rowPadding: {
      type: Object,
      required: true
    }
  },
  components: {
    ColorPicker
  },
  data () {
    return {
      expanded: true,
      swatches: EDITOR_COLOR_PALETTE,
      localBackgroundColor: this.rowBackgroundColor,
      localPadding: { ...this.rowPadding }
    }
  },
  methods: {
    handleExpandBtn () {
      this.expanded = !this.expanded
    },
    updateBackgroundColor () {
      this.$emit('update-background-color', this.localBackgroundColor)
    },
    increasePadding (side) {
      this.localPadding[side.toLowerCase()]++
      this.updatePadding(side)
    },
    decreasePadding (side) {
      if (this.localPadding[side.toLowerCase()] > 0) {
        this.localPadding[side.toLowerCase()]--
        this.updatePadding(side)
      }
    },
    updatePadding (side) {
      // Emitimos el evento con el padding actualizado para el lado especificado
      this.$emit('update-padding', { side: side.toLowerCase(), value: this.localPadding[side.toLowerCase()] })
    }
  },
  watch: {
    rowBackgroundColor (newColor) {
      this.localBackgroundColor = newColor
    },
    rowPadding (newPadding) {
      this.localPadding = { ...newPadding }
    }
  }
}
</script>

<style scoped>

.column-properties-panel {
  padding: 16px;
  padding-top: 0;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
}

label {
  color: #333;
}

.padding-control label {
  font-size: 12px;
  margin-bottom: 4px;
}

</style>
