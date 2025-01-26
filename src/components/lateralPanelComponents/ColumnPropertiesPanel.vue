<template>
    <div class="column-properties-panel">
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

      <!-- Border control -->
      <!-- <div class="property-wrapper">
        <p class="property-title">{{ $t('EDITOR.BORDER') }}</p>

        <div class="padding-controls">
          <div class="padding-control" v-for="side in ['Top', 'Right', 'Bottom', 'Left']" :key="side">
              <label>{{ side }}</label>
              <div class="control-wrapper">
                  <input type="number" v-model="localBorderWidth[side.toLowerCase()]" @input="updateBorderWidth(side)" min="0" class="padding-input" />
                  <span class="unit">px</span>
                  <button @click="decreaseBorderWidth(side)" class="adjust-button">−</button>
                  <button @click="increaseBorderWidth(side)" class="adjust-button">+</button>
              </div>
              <div class="color-picker">
                <color-picker
                  v-model="localBorderColor[side.toLowerCase()]"
                  @update:model-value="updateBorderColor(side)"
                ></color-picker>
              </div>
          </div>
        </div>
      </div> -->
    </div>
  </template>
  
  <script>

  import { EDITOR_COLOR_PALETTE } from '@/constants.js'
  import ColorPicker from '_editor/auxiliarComponents/ColorPicker.vue'

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
      },
      columnBorderWidth: {
        type: Object,
        required: true
      },
      columnBorderColor: {
        type: Object,
        required: true
      },
    },
    components: {
      ColorPicker
    },
    data () {
      return {
        swatches: EDITOR_COLOR_PALETTE,
        localBackgroundColor: this.columnBackgroundColor,
        localPadding: { ...this.columnPadding },
        localBorderWidth: { ...this.columnBorderWidth },
        localBorderColor: { ...this.columnBorderColor },
      }
    },
    methods: {
      triggerColorPicker (inputRef) {
        this.$refs[inputRef].click()
      },
      triggerBorderColorPicker (inputRef) {
        this.$refs[inputRef][0].click()
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
      },
      increaseBorderWidth(side) {
        this.localBorderWidth[side.toLowerCase()]++;
        this.updateBorderWidth(side);
      },
      decreaseBorderWidth(side) {
          if (this.localBorderWidth[side.toLowerCase()] > 0) {
          this.localBorderWidth[side.toLowerCase()]--;
          this.updateBorderWidth(side);
          }
      },
      updateBorderWidth(side) {
          this.$emit('update-border-width', { side: side.toLowerCase(), value: this.localBorderWidth[side.toLowerCase()] });
      },
      updateBorderColor(side) {
          this.$emit('update-border-color', { side: side.toLowerCase(), value: this.localBorderColor[side.toLowerCase()] });
      },
      upBlock(indx) {
        this.$emit('up-block', indx );
      },
      downBlock (indx) {
        this.$emit('down-block', indx );
      }
    },
    watch: {
      columnBackgroundColor (newColor) {
        this.localBackgroundColor = newColor
      },
      columnPadding(newPadding) {
        this.localPadding = { ...newPadding };
      },
      columnBorderWidth(newBorderWidth) {
        this.localBorderWidth = { ...newBorderWidth };
      },
      columnBorderColor(newBorderColor) {
        this.localBorderColor = { ...newBorderColor };
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
  
  .column-number {
    margin-top: 0;
    font-size: 14px;
    text-align: left;
  }
  
  label {
    color: #333;
  }
</style>
  