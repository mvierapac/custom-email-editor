<script setup>
import { defineProps, defineEmits } from 'vue';

const props = defineProps({
  block: Object,
  isSelected: Boolean,
  showUpBtn: Boolean,
  showDownBtn: Boolean,
});

const emit = defineEmits([
  'block-selected',
  'delete-block',
  'duplicate-block',
  'down-block',
  'up-block',
  'edit-text',
  'upload-image',
]);

const selectBlock = () => {
  emit('block-selected', props.block.blockId);
};

const emitDeleteBlock = () => {
  emit('delete-block', props.block.blockId);
};

const emitDuplicateBlock = () => {
  emit('duplicate-block', props.block.blockId);
};

const emitDownBlock = () => {
  emit('down-block');
};

const emitUpBlock = () => {
  emit('up-block');
};

const emitEditText = () => {
  emit('edit-text');
};

const emitUploadImage = () => {
  emit('upload-image');
};
</script>

<template>
  <div
    class="block-wrapper"
    :class="{ 'selected-block': isSelected }"
    :data-block-id="block.blockId"
    :style="{
      'padding-top': block.properties?.containerPadding.top + 'px',
      'padding-right': block.properties?.containerPadding.right + 'px',
      'padding-bottom': block.properties?.containerPadding.bottom + 'px',
      'padding-left': block.properties?.containerPadding.left + 'px',
      'text-align': block.properties?.alignment || 'center',
    }"
    @click="selectBlock"
  >
    <div v-if="isSelected" class="block-action-panel">
      <v-tooltip v-if="showUpBtn" content-class="tooltip" location="bottom">
        <template #activator="{ props }">
          <button
            v-bind="props"
            class="block-action-icon mdi mdi-chevron-up"
            :style="{ fontSize: '26px' }"
            @click.stop="emitUpBlock"
          ></button>
        </template>
        <span>{{ $t('EDITOR.UP_BLOCK') }}</span>
      </v-tooltip>

      <v-tooltip v-if="showDownBtn" content-class="tooltip" location="bottom">
        <template #activator="{ props }">
          <button
            v-bind="props"
            class="block-action-icon mdi mdi-chevron-down"
            :style="{ fontSize: '26px' }"
            @click.stop="emitDownBlock"
          ></button>
        </template>
        <span>{{ $t('EDITOR.DOWN_BLOCK') }}</span>
      </v-tooltip>

      <v-tooltip v-if="block.type === 'text'" content-class="tooltip" location="bottom">
        <template #activator="{ props }">
          <button v-bind="props" class="block-action-icon mdi mdi-pencil" @click.stop="emitEditText"></button>
        </template>
        <span>{{ $t('EDITOR.EDIT_TEXT') }}</span>
      </v-tooltip>

      <v-tooltip v-if="block.type === 'image' && block.editable !== false" content-class="tooltip" location="bottom">
        <template #activator="{ props }">
          <button v-bind="props" class="block-action-icon mdi mdi-image" @click.stop="emitUploadImage"></button>
        </template>
        <span>{{ $t('EDITOR.UPLOAD_IMAGE') }}</span>
      </v-tooltip>

      <v-tooltip content-class="tooltip" location="bottom">
        <template #activator="{ props }">
          <button class="block-action-icon mdi mdi-delete" v-bind="props" @click.stop="emitDeleteBlock"></button>
        </template>
        <span>{{ $t('COMMON.DELETE') }}</span>
      </v-tooltip>

      <v-tooltip content-class="tooltip" location="bottom">
        <template #activator="{ props }">
          <button class="block-action-icon mdi-content-copy" v-bind="props" @click.stop="emitDuplicateBlock"></button>
        </template>
        <span>{{ $t('COMMON.COPY') }}</span>
      </v-tooltip>
    </div>

    <button
      v-if="block.type === 'button'"
      :style="{
        backgroundColor: block.properties.backgroundColor,
        color: block.properties.color,
        padding: block.properties.padding,
        borderRadius: block.properties.borderRadius,
        border: 'none',
        fontSize: '13px',
        'line-height': '120%',
        'font-weigth': '400',
      }"
    >
      <a :href="block.properties.href" :style="{ color: 'white' }">
        {{ block.properties.text }}
      </a>
    </button>

    <p
      v-else-if="block.type === 'text'"
      v-html="block.properties.text"
      class="no-margin"
      :class="block.blockId"
      :style="{
        fontSize: block.properties.fontSize,
        color: block.properties.color,
        lineHeight: block.properties.lineHeight + 'px',
      }"
    ></p>

    <p
      v-else-if="block.type === 'texticon'"
      class="no-margin"
      :class="block.blockId"
      :style="{
        fontSize: block.properties.fontSize,
        color: block.properties.color,
      }"
    >
      <img
        :src="block.properties.iconSrc"
        :width="block.properties.iconSize + 'px'"
        alt="Icono"
        style="display: inline-block; vertical-align: middle"
      />
      <span
        :style="{
          fontSize: block.properties.fontSize,
          color: block.properties.color,
        }"
        v-html="block.properties.text"
      ></span>
    </p>

    <img
      v-else-if="block.type === 'image'"
      :src="block.properties.src"
      :alt="block.properties.alt || 'Imagen de ejemplo'"
      :href="block.properties.href"
      :style="{
        width: block.properties.width + '%',
        height: block.properties.height,
        display: 'inline-block',
        'vertical-align': 'middle',
      }"
    />
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixins.scss';
a {
  text-decoration: none;
}
.block-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
  display: block;
  box-sizing: border-box;
  outline: none;
  padding: 10px;
}

.selected-block {
  outline: 2px solid #1464a5;
  outline-offset: -1px;
  box-sizing: border-box;
}

.no-margin {
  margin: 0;
}

.no-margin > p {
  margin: 0;
}

.block-action-panel {
  z-index: 21;
  position: absolute;
  bottom: 1px;
  right: 0;
  transform: translateY(100%);
  display: flex;
  gap: 8px;
  background: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
  padding: 4px;
}

.block-action-icon {
  min-width: 26px;
  font-size: 18px;
  cursor: pointer;
  color: $core-blue;
}
</style>
