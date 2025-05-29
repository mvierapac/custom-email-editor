<script setup>
import { ref, reactive, watch } from 'vue';
import { EDITOR_COLOR_PALETTE } from '@/constants.js';
import ColorPicker from '_editor/auxiliarComponents/ColorPicker.vue';

const props = defineProps({
  rowBackgroundColor: { type: String, required: true },
  rowPadding: { type: Object, required: true },
});

const emit = defineEmits(['update-background-color', 'update-padding']);

const expanded = ref(true);
const swatches = EDITOR_COLOR_PALETTE;

const localBackgroundColor = ref(props.rowBackgroundColor);
const localPadding = reactive({ ...props.rowPadding });

watch(
  () => props.rowBackgroundColor,
  (newVal) => {
    localBackgroundColor.value = newVal;
  }
);

watch(
  () => props.rowPadding,
  (newPadding) => {
    Object.assign(localPadding, newPadding);
  }
);

const handleExpandBtn = () => {
  expanded.value = !expanded.value;
};

const updateBackgroundColor = () => {
  emit('update-background-color', localBackgroundColor.value);
};

const updatePadding = (side) => {
  emit('update-padding', {
    side: side.toLowerCase(),
    value: localPadding[side.toLowerCase()],
  });
};

const increasePadding = (side) => {
  localPadding[side.toLowerCase()]++;
  updatePadding(side);
};

const decreasePadding = (side) => {
  const key = side.toLowerCase();
  if (localPadding[key] > 0) {
    localPadding[key]--;
    updatePadding(side);
  }
};
</script>

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
          <color-picker v-model="localBackgroundColor" @update:model-value="updateBackgroundColor" />
        </div>
      </div>

      <div class="property-wrapper">
        <p class="property-title">{{ $t('EDITOR.PADDING') }}</p>
        <div class="padding-controls">
          <div class="padding-control" v-for="side in ['Top', 'Right', 'Bottom', 'Left']" :key="side">
            <label>{{ side }}</label>
            <div class="control-wrapper">
              <input
                type="number"
                v-model="localPadding[side.toLowerCase()]"
                @input="updatePadding(side)"
                min="0"
                class="padding-input"
              />
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
