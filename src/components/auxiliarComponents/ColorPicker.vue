<script setup>
import { computed } from 'vue';

const props = defineProps({
  showPicker: {
    type: Boolean,
    default: false,
  },
  modelValue: {
    type: String,
    default: '',
  },
});

const emit = defineEmits(['update:modelValue']);

const inputValue = computed({
  get: () => props.modelValue,
  set: (val) => emit('update:modelValue', val),
});
</script>

<template>
  <v-menu :close-on-content-click="false" offset-y>
    <template #activator="{ props }">
      <div
        class="color-preview"
        v-bind="props"
        :style="{ backgroundColor: inputValue, cursor: 'pointer', border: '1px solid #ccc' }"
      />
    </template>

    <v-color-picker v-model="inputValue" mode="hex" hide-canvas show-swatches swatches-max-height="400px" />
  </v-menu>
</template>

<style scoped lang="scss">
.color-preview {
  width: 28px;
  height: 28px;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
}

.v-color-picker :deep(.v-color-picker-preview__sliders) {
  display: none;
}
</style>
