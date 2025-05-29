<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
  containerPadding: {
    type: Object,
    required: true,
  },
  lineHeight: {
    type: Number,
    required: true,
    default: 16,
  },
});

const emit = defineEmits(['update-container-padding', 'update-line-height']);

const localContainerPadding = reactive({ ...props.containerPadding });
const localLineHeight = ref(props.lineHeight);

watch(
  () => props.containerPadding,
  (newVal) => {
    Object.assign(localContainerPadding, newVal);
  }
);

watch(
  () => props.lineHeight,
  (newVal) => {
    localLineHeight.value = newVal;
  }
);

const updateLocalContainerPadding = (side) => {
  emit('update-container-padding', {
    side: side.toLowerCase(),
    value: localContainerPadding[side.toLowerCase()],
  });
};

const increaseLocalPadding = (side) => {
  localContainerPadding[side.toLowerCase()]++;
  updateLocalContainerPadding(side);
};

const decreaseLocalPadding = (side) => {
  const key = side.toLowerCase();
  if (localContainerPadding[key] > 0) {
    localContainerPadding[key]--;
    updateLocalContainerPadding(side);
  }
};

const updateLocalLineHeight = () => {
  emit('update-line-height', localLineHeight.value);
};

const increaseLocalLineHeight = () => {
  localLineHeight.value++;
  updateLocalLineHeight();
};

const decreaseLocalLineHeight = () => {
  localLineHeight.value--;
  updateLocalLineHeight();
};
</script>

<template>
  <div class="properties-panel lateral-panel-section-padding sticky-panel">
    <p class="properties-title">{{ $t('EDITOR.TEXT_PROPERTIES') }}</p>

    <!-- Line Height -->
    <div class="property-wrapper">
      <p class="property-title">{{ $t('EDITOR.LINE_HEIGHT') }}</p>
      <div class="padding-controls">
        <div class="control-wrapper">
          <input type="number" v-model="localLineHeight" @input="updateLocalLineHeight" min="0" class="padding-input" />
          <span class="unit">px</span>
          <button @click="decreaseLocalLineHeight" class="adjust-button">−</button>
          <button @click="increaseLocalLineHeight" class="adjust-button">+</button>
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
            <input
              type="number"
              v-model="localContainerPadding[side.toLowerCase()]"
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

<style scoped>
/* Puedes añadir estilos si lo deseas */
</style>
