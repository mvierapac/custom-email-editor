<script setup>
import { reactive, watch } from 'vue';
import { EDITOR_COLOR_PALETTE } from '@/constants.js';
import ColorPicker from '_editor/auxiliarComponents/ColorPicker.vue';

const props = defineProps({
  columnBackgroundColor: { type: String, required: true },
  columnIndex: { type: Number, required: true },
  columnPadding: { type: Object, required: true },
  columnBorderWidth: { type: Object, required: true },
  columnBorderColor: { type: Object, required: true },
});

const emit = defineEmits([
  'update-background-color',
  'update-padding',
  'update-border-width',
  'update-border-color',
  'up-block',
  'down-block',
]);

const swatches = EDITOR_COLOR_PALETTE;

const state = reactive({
  localBackgroundColor: props.columnBackgroundColor,
  localPadding: { ...props.columnPadding },
  localBorderWidth: { ...props.columnBorderWidth },
  localBorderColor: { ...props.columnBorderColor },
});

watch(
  () => props.columnBackgroundColor,
  (newVal) => {
    state.localBackgroundColor = newVal;
  }
);

watch(
  () => props.columnPadding,
  (newVal) => {
    state.localPadding = { ...newVal };
  }
);

watch(
  () => props.columnBorderWidth,
  (newVal) => {
    state.localBorderWidth = { ...newVal };
  }
);

watch(
  () => props.columnBorderColor,
  (newVal) => {
    state.localBorderColor = { ...newVal };
  }
);

const updateBackgroundColor = () => {
  emit('update-background-color', state.localBackgroundColor);
};

const updatePadding = (side) => {
  emit('update-padding', {
    side: side.toLowerCase(),
    value: state.localPadding[side.toLowerCase()],
  });
};

const increasePadding = (side) => {
  state.localPadding[side.toLowerCase()]++;
  updatePadding(side);
};

const decreasePadding = (side) => {
  const key = side.toLowerCase();
  if (state.localPadding[key] > 0) {
    state.localPadding[key]--;
    updatePadding(side);
  }
};

const updateBorderWidth = (side) => {
  emit('update-border-width', {
    side: side.toLowerCase(),
    value: state.localBorderWidth[side.toLowerCase()],
  });
};

const increaseBorderWidth = (side) => {
  state.localBorderWidth[side.toLowerCase()]++;
  updateBorderWidth(side);
};

const decreaseBorderWidth = (side) => {
  const key = side.toLowerCase();
  if (state.localBorderWidth[key] > 0) {
    state.localBorderWidth[key]--;
    updateBorderWidth(side);
  }
};

const updateBorderColor = (side) => {
  emit('update-border-color', {
    side: side.toLowerCase(),
    value: state.localBorderColor[side.toLowerCase()],
  });
};

const upBlock = (indx) => emit('up-block', indx);
const downBlock = (indx) => emit('down-block', indx);
</script>

<template>
  <div class="column-properties-panel">
    <div class="property-wrapper">
      <div class="color-picker">
        <label class="property-title">{{ $t('EDITOR.BG_COLOR') }}</label>
        <color-picker v-model="state.localBackgroundColor" @update:model-value="updateBackgroundColor()" />
      </div>
    </div>

    <!-- Padding control -->
    <div class="property-wrapper">
      <p class="property-title">{{ $t('EDITOR.PADDING') }}</p>
      <div class="padding-controls">
        <div class="padding-control" v-for="side in ['Top', 'Right', 'Bottom', 'Left']" :key="side">
          <label>{{ side }}</label>
          <div class="control-wrapper">
            <input
              type="number"
              v-model="state.localPadding[side.toLowerCase()]"
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

    <!-- Border control -->
    <!--
    <div class="property-wrapper">
      <p class="property-title">{{ $t('EDITOR.BORDER') }}</p>

      <div class="padding-controls">
        <div class="padding-control" v-for="side in ['Top', 'Right', 'Bottom', 'Left']" :key="side">
          <label>{{ side }}</label>
          <div class="control-wrapper">
            <input
              type="number"
              v-model="state.localBorderWidth[side.toLowerCase()]"
              @input="updateBorderWidth(side)"
              min="0"
              class="padding-input"
            />
            <span class="unit">px</span>
            <button @click="decreaseBorderWidth(side)" class="adjust-button">−</button>
            <button @click="increaseBorderWidth(side)" class="adjust-button">+</button>
          </div>
          <div class="color-picker">
            <color-picker
              v-model="state.localBorderColor[side.toLowerCase()]"
              @update:model-value="updateBorderColor(side)"
            />
          </div>
        </div>
      </div>
    </div>
    -->
  </div>
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

.column-number {
  margin-top: 0;
  font-size: 14px;
  text-align: left;
}

label {
  color: #333;
}
</style>
