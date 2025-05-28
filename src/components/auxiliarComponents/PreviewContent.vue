<script setup>
import { ref, watch, onBeforeUnmount } from 'vue';

const props = defineProps({
  template: {
    type: String,
    default: '',
  },
  showPreview: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

const contentWidth = ref(1280);
const iframeUrl = ref(null);

watch(
  () => props.showPreview,
  (newVal) => {
    if (newVal) loadTemplate();
  }
);

const setContentWidth = (width) => {
  contentWidth.value = width;
};

const emitClose = () => {
  if (iframeUrl.value) {
    URL.revokeObjectURL(iframeUrl.value);
    iframeUrl.value = null;
  }
  emit('close');
};

const loadTemplate = () => {
  const htmlContent = props.template;
  const blob = new Blob([htmlContent], { type: 'text/html' });
  iframeUrl.value = URL.createObjectURL(blob);
};

onBeforeUnmount(() => {
  if (iframeUrl.value) {
    URL.revokeObjectURL(iframeUrl.value);
  }
});
</script>

<template>
  <div v-if="showPreview">
    <div class="overlay"></div>
    <div ref="dialog" class="custom-dialog">
      <div class="toolbar">
        <div class="toolbar-left"></div>
        <div class="toolbar-center">
          <button
            class="mdi mdi-monitor toolbar__button"
            :class="{ 'toolbar__button--selected': contentWidth === 1280 }"
            @click="setContentWidth(1280)"
          ></button>
          <button
            class="mdi mdi-tablet toolbar__button"
            :class="{ 'toolbar__button--selected': contentWidth === 768 }"
            @click="setContentWidth(768)"
          ></button>
          <button
            class="mdi mdi-cellphone toolbar__button"
            :class="{ 'toolbar__button--selected': contentWidth === 375 }"
            @click="setContentWidth(375)"
          ></button>

          <div class="input-width-wrapper">
            <div class="padding-controls">
              <div class="control-wrapper">
                <input type="number" v-model="contentWidth" min="0" max="4000" class="padding-input" />
                <span class="unit">px</span>
              </div>
            </div>
          </div>
        </div>

        <div class="toolbar-right">
          <button class="mdi mdi-close toolbar__button" @click="emitClose"></button>
        </div>
      </div>

      <div class="wrapper-content">
        <div class="area-content" :style="{ width: `${contentWidth}px` }">
          <iframe :src="iframeUrl" style="width: 100%; height: auto; border: none"></iframe>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: opacity;
  will-change: opacity;
  z-index: 999;
}
.custom-dialog {
  width: min(85vw, 1400px);
  min-height: 500px;
  border: none;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 34px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5000;
  animation: fadeIn 0.2s ease-in-out;
}

.area-content {
  background-color: #e9e9e9;
  outline: 1px solid #d3d3d3;
  display: flex;
  justify-content: center;
  overflow: hidden;
}

.wrapper-content {
  padding: 16px 0;
  min-height: inherit;
  display: flex;
  justify-content: center;
}

.toolbar {
  display: flex;
  background-color: #ffffff;
  border: 1px solid #ddd;

  &__button {
    font-size: 20px;
    min-width: 50px;
    height: 40px;
    background-color: rgb(255, 255, 255);
    color: #004481;
    cursor: pointer;
    &:hover {
      background-color: rgb(244, 244, 244);
    }
    &--selected {
      background-color: rgb(244, 244, 244);
    }
  }
}

.toolbar-left {
  display: flex;
  flex: 1 1 0%;
}

.toolbar-center {
  display: flex;
  justify-content: center;
  flex: 1 1 0%;
}

.toolbar-right {
  display: flex;
  justify-content: flex-end;
  flex: 1 1 0%;
}

.input-width-wrapper {
  display: flex;
  align-items: center;
}
.padding-input {
  width: 50px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
