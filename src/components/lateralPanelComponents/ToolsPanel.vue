<script setup>
import { ref } from 'vue';

const emit = defineEmits(['drag-start']);
const expanded = ref(true);

const handleExpandBtn = () => {
  expanded.value = !expanded.value;
};

const startDrag = (type, btnColor = null) => {
  emit('drag-start', type, btnColor);
};
</script>

<template>
  <div>
    <button class="collapsable-panel-button" @click="handleExpandBtn">
      <p>{{ $t('EDITOR.BLOCKS.ELEMENTS') }}</p>
      <i class="mdi mdi-chevron-up" v-if="expanded"></i>
      <i class="mdi mdi-chevron-down" v-else></i>
    </button>

    <div class="tool-panel lateral-panel-section-padding" v-if="expanded">
      <div class="tool-panel__group">
        <div class="draggable-tool" draggable="true" @dragstart="startDrag('text', '#1973b8')">
          <img src="_editor/images/text.png" class="filter-invert" :style="{ 'max-width': '80%' }" alt="image" />
          <p>{{ $t('EDITOR.BLOCKS.TEXT') }}</p>
        </div>

        <div class="draggable-tool" draggable="true" @dragstart="startDrag('image')">
          <img src="_editor/images/image_placeholder.png" class="filter-invert fit-content" alt="image" />
          <p>{{ $t('EDITOR.BLOCKS.IMAGE') }}</p>
        </div>
      </div>

      <div class="tool-panel__group">
        <div class="draggable-tool" draggable="true" @dragstart="startDrag('button', '#1973b8')">
          <img src="_editor/images/button.png" alt="btn-blu" />
          <p>{{ $t('EDITOR.BLOCKS.BTN_BLUE') }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.tool-panel {
  margin-top: 16px;
  padding-bottom: 16px;
  width: 100%;
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  border-bottom: 1px solid #ddd;

  &__group {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }
}

.collapsable-panel-button {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 12px;
  align-items: center;
  font-size: 14px;
  font-weight: 600;
  border-bottom: 1px solid #ddd;
  transition: background-color 0.3s ease;
}

.collapsable-panel-button i {
  font-size: 18px;
}

.collapsable-panel-button:hover {
  background-color: rgb(244, 244, 244);
}

.draggable-item {
  padding: 10px;
  background-color: #f0f0f0;
  border: 1px solid #ccc;
  margin-bottom: 10px;
  cursor: grab;
}

.draggable-tool {
  position: relative;
  flex: 1 1 0%;
  background-color: rgb(255, 255, 255);
  min-width: 100px;
  max-width: 100px;
  height: 80px;
  line-height: 16px;
  text-align: center;
  font-size: 11px;
  font-weight: 400;
  border: 1px solid rgb(212, 212, 212);
  border-radius: 0.13144rem;
  box-shadow: rgba(0, 0, 0, 0.05) 0px 1px 1px;
  user-select: none;
  cursor: -webkit-grab;
  transition:
    box-shadow 0.1s,
    transform 0.05s ease-in;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 8px;
  padding-top: 12px;
  padding-bottom: 2px;
}

.draggable-tool > img {
  width: 100%;
  margin: 0 auto;
  flex-shrink: 0;
}

.draggable-tool > p {
  margin-top: auto;
}

.draggable-tool:hover {
  box-shadow: rgba(0, 0, 0, 0.17) -2px 7px 20px;
  border: 1px solid rgb(238, 238, 238);
}

.empty-tool {
  flex: 1 1 0%;
  min-width: 100px;
  max-width: 100px;
}

.filter-invert {
  filter: invert(1) brightness(0.5);
}

.fit-content {
  max-width: fit-content;
}
</style>
