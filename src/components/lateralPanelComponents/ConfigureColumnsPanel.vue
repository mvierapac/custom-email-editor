<script setup>
import { ref, watch, onMounted } from 'vue';

const props = defineProps({
  emptyRowSelected: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['configure-columns']);

const expanded = ref(true);

onMounted(() => {
  expanded.value = props.emptyRowSelected;
});

watch(
  () => props.emptyRowSelected,
  (newVal) => {
    expanded.value = newVal;
  }
);

const handleExpandBtn = () => {
  expanded.value = !expanded.value;
};

const emitConfigureColumns = (numColumns, proportions = []) => {
  emit('configure-columns', numColumns, proportions);
};
</script>

<template>
  <div>
    <button class="collapsable-panel-button" @click="handleExpandBtn">
      <p>Estructura de la fila</p>
      <i class="mdi mdi-chevron-up" v-if="expanded"></i>
      <i class="mdi mdi-chevron-down" v-else></i>
    </button>

    <section class="lateral-panel-section-padding" v-if="expanded">
      <div class="configure-columns-panel">
        <!-- 100% -->
        <div style="width: calc(50% - 8px)">
          <div class="set-columns-tool set-columns-tool-selected">
            <button class="set-columns-buttons" style="flex: 0 0 100%" @click="emitConfigureColumns(1)">
              <div class="set-columns-content">100%</div>
            </button>
          </div>
        </div>

        <!-- 50/50 -->
        <div style="width: calc(50% - 8px)">
          <div class="set-columns-tool set-columns-tool-selected">
            <button class="set-columns-buttons" style="flex: 0 0 50%" @click="emitConfigureColumns(2)">
              <div class="set-columns-content">50%</div>
            </button>
            <button class="set-columns-buttons" style="flex: 0 0 50%" @click="emitConfigureColumns(2)">
              <div class="set-columns-content">50%</div>
            </button>
          </div>
        </div>

        <!-- 33/67 -->
        <div style="width: calc(50% - 8px)">
          <div class="set-columns-tool set-columns-tool-selected">
            <button class="set-columns-buttons" style="flex: 0 0 33%" @click="emitConfigureColumns(2, [33, 67])">
              <div class="set-columns-content">33%</div>
            </button>
            <button class="set-columns-buttons" style="flex: 0 0 67%" @click="emitConfigureColumns(2, [33, 67])">
              <div class="set-columns-content">67%</div>
            </button>
          </div>
        </div>

        <!-- 67/33 -->
        <div style="width: calc(50% - 8px)">
          <div class="set-columns-tool set-columns-tool-selected">
            <button class="set-columns-buttons" style="flex: 0 0 67%" @click="emitConfigureColumns(2, [67, 33])">
              <div class="set-columns-content">67%</div>
            </button>
            <button class="set-columns-buttons" style="flex: 0 0 33%" @click="emitConfigureColumns(2, [67, 33])">
              <div class="set-columns-content">33%</div>
            </button>
          </div>
        </div>

        <!-- 33/33/33 -->
        <div style="width: calc(50% - 8px)">
          <div class="set-columns-tool set-columns-tool-selected">
            <button class="set-columns-buttons" style="flex: 0 0 33%" @click="emitConfigureColumns(3)">
              <div class="set-columns-content">33%</div>
            </button>
            <button class="set-columns-buttons" style="flex: 0 0 33%" @click="emitConfigureColumns(3)">
              <div class="set-columns-content">33%</div>
            </button>
            <button class="set-columns-buttons" style="flex: 0 0 33%" @click="emitConfigureColumns(3)">
              <div class="set-columns-content">33%</div>
            </button>
          </div>
        </div>

        <!-- 25/25/25/25 -->
        <div style="width: calc(50% - 8px)">
          <div class="set-columns-tool set-columns-tool-selected">
            <button class="set-columns-buttons" style="flex: 0 0 25%" @click="emitConfigureColumns(4)">
              <div class="set-columns-content">25%</div>
            </button>
            <button class="set-columns-buttons" style="flex: 0 0 25%" @click="emitConfigureColumns(4)">
              <div class="set-columns-content">25%</div>
            </button>
            <button class="set-columns-buttons" style="flex: 0 0 25%" @click="emitConfigureColumns(4)">
              <div class="set-columns-content">25%</div>
            </button>
            <button class="set-columns-buttons" style="flex: 0 0 25%" @click="emitConfigureColumns(4)">
              <div class="set-columns-content">25%</div>
            </button>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped>
/* Se mantiene sin cambios */
.configure-columns-panel {
  display: flex;
  gap: 8px;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 8px;
}

.column-button {
  width: 45%;
  padding: 10px 15px;
  font-size: 16px;
  background-color: #d3d3d3;
  color: black;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.column-button:hover {
  background-color: #a9a9a9;
}

.set-columns-tool {
  display: flex;
  height: 40px;
  padding: 0px;
  background-color: rgb(255, 255, 255);
  border-radius: 2px;
}

.set-columns-tool:hover .set-columns-buttons {
  background-color: rgb(255, 255, 255);
}

.set-columns-tool .set-columns-buttons {
  position: relative;
  height: 100%;
  padding: 0px;
  border: none;
  cursor: pointer;
  overflow: hidden;
  background-color: rgb(244, 244, 244);
  box-shadow: rgb(212, 212, 212) 0px 0px 0px 1px;
  transition: background-color 0.3s ease;
}

.set-columns-tool .set-columns-buttons:first-child {
  border-top-left-radius: 2px;
  border-bottom-left-radius: 2px;
}

.set-columns-tool .set-columns-buttons:last-child {
  border-top-right-radius: 2px;
  border-bottom-right-radius: 2px;
}

.set-columns-content {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  text-align: center;
  font-size: 12px;
  color: rgb(81, 81, 81);
}

.lateral-panel-section-padding {
  margin-top: 12px;
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
</style>
