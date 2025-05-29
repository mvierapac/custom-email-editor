<script setup>
import { ref, reactive, watch } from 'vue';

const props = defineProps({
  imageLink: { type: String, required: true },
  imageWidth: { type: Number, default: 100 },
  containerPadding: { type: Object, required: true },
  alignment: { type: String, required: true },
});

const emit = defineEmits([
  'update-img-src',
  'update-img-href',
  'update-img-width',
  'update-block-alignment',
  'update-container-padding',
]);

const fileInput = ref(null);

const localImageLink = ref(props.imageLink);
const localImageWidth = ref(props.imageWidth);
const localContainerPadding = reactive({ ...props.containerPadding });

watch(
  () => props.imageLink,
  (newVal) => {
    localImageLink.value = newVal;
  }
);

watch(
  () => props.imageWidth,
  (newVal) => {
    localImageWidth.value = newVal;
  }
);

watch(
  () => props.containerPadding,
  (newPadding) => {
    Object.assign(localContainerPadding, newPadding);
  }
);

const isSelectedAlignment = (align) => props.alignment === align;

const updateHref = () => {
  emit('update-img-href', localImageLink.value);
};

const updateImageWidth = () => {
  emit('update-img-width', Number(localImageWidth.value));
};

const updateAlignment = (align) => {
  emit('update-block-alignment', align);
};

const updateLocalPadding = (side) => {
  emit('update-container-padding', {
    side: side.toLowerCase(),
    value: localContainerPadding[side.toLowerCase()],
  });
};

const increaseLocalPadding = (side) => {
  localContainerPadding[side.toLowerCase()]++;
  updateLocalPadding(side);
};

const decreaseLocalPadding = (side) => {
  const key = side.toLowerCase();
  if (localContainerPadding[key] > 0) {
    localContainerPadding[key]--;
    updateLocalPadding(side);
  }
};

const triggerFileInput = () => {
  fileInput.value?.click();
};

// Si hay lógica de subida, se debería definir aquí
const uploadImg = () => {
  // Intencionadamente vacío (se usa desde el padre o personalizado)
};
</script>

<template>
  <div class="properties-panel lateral-panel-section-padding sticky-panel">
    <p class="properties-title">{{ $t('EDITOR.IMAGE_PROPERTIES') }}</p>

    <div style="margin-bottom: 12px">
      <label for="attachImg">
        <span class="upload-img-button">{{ $t('EDITOR.UPLOAD_IMAGE') }}</span>
      </label>
      <input type="file" ref="fileInput" id="attachImg" name="attachImg" value="" @change="uploadImg" />
    </div>

    <div class="input-container">
      <label for="url-input">{{ $t('EDITOR.URL') }}</label>
      <input type="text" id="url-input" v-model="localImageLink" @blur="updateHref" placeholder="https://example.com" />
    </div>

    <div class="property-wrapper">
      <p class="property-title">{{ $t('EDITOR.IMAGE_WIDTH') }}</p>
      <div class="input-range-wrapper">
        <input type="range" id="width-slider" v-model="localImageWidth" @input="updateImageWidth" min="10" max="100" />
        <span>{{ localImageWidth }}%</span>
      </div>
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
              v-model="localContainerPadding[side.toLowerCase()]"
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

<style scoped lang="scss">
input[type='file'] {
  display: none;
}

.upload-img-button {
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: #f0f0f0;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
}
.upload-img-button:hover {
  border-color: #48424200;
}

.input-range-wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
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
