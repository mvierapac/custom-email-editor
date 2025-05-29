<script setup>
import { reactive, watch, toRefs } from 'vue';

const props = defineProps({
  buttonLink: { type: String, required: true },
  buttonText: { type: String, required: true },
  containerPadding: { type: Object, required: true },
  alignment: { type: String, required: true },
});

const emit = defineEmits([
  'update-button-href',
  'update-button-text',
  'update-button-alignment',
  'update-container-padding',
]);

const localState = reactive({
  localButtonLink: props.buttonLink,
  localButtonText: props.buttonText,
  localContainerPadding: { ...props.containerPadding },
});

watch(
  () => props.buttonLink,
  (newVal) => {
    localState.localButtonLink = newVal;
  }
);

watch(
  () => props.buttonText,
  (newVal) => {
    localState.localButtonText = newVal;
  }
);

watch(
  () => props.containerPadding,
  (newPadding) => {
    localState.localContainerPadding = { ...newPadding };
  }
);

const isSelectedAlignment = (align) => props.alignment === align;

const updateHref = () => {
  emit('update-button-href', localState.localButtonLink);
};

const updateText = () => {
  emit('update-button-text', localState.localButtonText);
};

const updateAlignment = (align) => {
  emit('update-button-alignment', align);
};

const updateLocalContainerPadding = (side) => {
  emit('update-container-padding', {
    side: side.toLowerCase(),
    value: localState.localContainerPadding[side.toLowerCase()],
  });
};

const increaseLocalPadding = (side) => {
  localState.localContainerPadding[side.toLowerCase()]++;
  updateLocalContainerPadding(side);
};

const decreaseLocalPadding = (side) => {
  const key = side.toLowerCase();
  if (localState.localContainerPadding[key] > 0) {
    localState.localContainerPadding[key]--;
    updateLocalContainerPadding(side);
  }
};
</script>

<template>
  <div class="properties-panel lateral-panel-section-padding sticky-panel">
    <p class="properties-title">{{ $t('EDITOR.BUTTON_PROPERTIES') }}</p>

    <div class="input-container">
      <label for="url-input">{{ $t('EDITOR.URL') }}</label>
      <input
        type="text"
        id="url-input"
        v-model="localState.localButtonLink"
        @blur="updateHref"
        placeholder="https://example.com"
      />
    </div>

    <div class="input-container">
      <label for="button-text">{{ $t('EDITOR.TEXT') }}</label>
      <input type="text" id="button-text" v-model="localState.localButtonText" @blur="updateText" placeholder="Texto" />
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

    <div class="property-wrapper">
      <p class="property-title">{{ $t('EDITOR.CONTAINER_PADDING') }}</p>
      <div class="padding-controls">
        <div class="padding-control" v-for="side in ['Top', 'Right', 'Bottom', 'Left']" :key="side">
          <label>{{ side }}</label>
          <div class="control-wrapper">
            <input
              type="number"
              v-model="localState.localContainerPadding[side.toLowerCase()]"
              @input="updateLocalContainerPadding(side)"
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
