<template>
  <div class="properties-panel lateral-panel-section-padding sticky-panel">
    <p class="properties-title">{{ $t('EDITOR.BUTTON_PROPERTIES') }}</p>
    <div class="input-container">
      <label for="url-input">{{ $t('EDITOR.URL') }}</label>
      <input
        type="text"
        id="url-input"
        v-model="localButtonLink"
        @blur="updateHref"
        placeholder="https://example.com"
      />
    </div>
    <div class="input-container">
      <label for="button-text">{{ $t('EDITOR.TEXT') }}</label>
      <input type="text" id="button-text" v-model="localButtonText" @blur="updateText" placeholder="Texto" />
    </div>
    <div class="property-wrapper">
      <p class="property-title">{{ $t('EDITOR.ALIGNMENT') }}</p>
      <div class="align-buttons">
        <button
          class="align-button"
          :class="{ 'align-button--selected': isSelectedAlignment('left') }"
          @click="updateAlignment('left')"
        >
          <v-icon>mdi-format-align-left</v-icon>
        </button>
        <button
          class="align-button"
          :class="{ 'align-button--selected': isSelectedAlignment('center') }"
          @click="updateAlignment('center')"
        >
          <v-icon>mdi-format-align-center</v-icon>
        </button>
        <button
          class="align-button"
          :class="{ 'align-button--selected': isSelectedAlignment('right') }"
          @click="updateAlignment('right')"
        >
          <v-icon>mdi-format-align-right</v-icon>
        </button>
      </div>
    </div>
    <!-- Padding control -->
    <div class="property-wrapper">
      <p class="property-title">{{ $t('EDITOR.CONTAINER_PADDING') }}</p>
      <div class="padding-controls">
        <div class="padding-control" v-for="side in ['Top', 'Right', 'Bottom', 'Left']" :key="side">
          <label>{{ side }}</label>
          <div class="control-wrapper">
            <input
              type="number"
              v-model="containerPadding[side.toLowerCase()]"
              @input="updateLocalPadding(side)"
              min="0"
              class="padding-input"
            />
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
      required: true,
    },
    buttonText: {
      type: String,
      required: true,
    },
    containerPadding: {
      type: Object,
      required: true,
    },
    alignment: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      localButtonLink: this.buttonLink,
      localButtonText: this.buttonText,
      localContainerPadding: { ...this.containerPadding },
    };
  },
  methods: {
    isSelectedAlignment(align) {
      return this.alignment === align;
    },
    updateHref() {
      this.$emit('update-button-href', this.localButtonLink);
    },
    updateText() {
      this.$emit('update-button-text', this.localButtonText);
    },
    updateAlignment(alignment) {
      this.$emit('update-button-alignment', alignment);
    },
    increaseLocalPadding(side) {
      this.localContainerPadding[side.toLowerCase()]++;
      this.updateLocalContainerPadding(side);
    },
    decreaseLocalPadding(side) {
      if (this.localContainerPadding[side.toLowerCase()] > 0) {
        this.localContainerPadding[side.toLowerCase()]--;
        this.updateLocalContainerPadding(side);
      }
    },
    updateLocalContainerPadding(side) {
      this.$emit('update-container-padding', {
        side: side.toLowerCase(),
        value: this.localContainerPadding[side.toLowerCase()],
      });
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
  },
};
</script>

<style scoped lang="scss">
.properties-title {
  padding: 12px 4px;
  justify-content: space-between;
  font-size: 14px;
  font-weight: 600;
}
.align-buttons {
  margin-top: 8px;
  display: flex;
  gap: 4px;
}

.align-button {
  background-color: #ffff;
  border: 1px solid #d3d3d3;
  border-radius: 2px;
  padding: 0.6em 1.2em;
  font-size: 12px;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #d3d3d3;
  }

  &--selected {
    background-color: #d3d3d3;
  }
}
</style>
