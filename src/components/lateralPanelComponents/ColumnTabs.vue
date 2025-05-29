<script setup>
const props = defineProps({
  columnsCount: {
    type: Number,
    required: true,
  },
  activeColumn: {
    type: Number,
    required: true,
  },
});

const emit = defineEmits(['column-selected', 'add-column', 'remove-column']);

const selectTab = (columnIndex) => {
  emit('column-selected', columnIndex);
};

const addColumn = () => {
  emit('add-column', props.columnsCount + 1);
};

const removeColumn = () => {
  emit('remove-column', props.columnsCount - 1);
};
</script>

<template>
  <div class="lateral-panel-section-padding">
    <p class="properties-title">Propiedades de la columna</p>

    <div class="column-tabs-container">
      <div class="column-tabs">
        <div
          v-for="col in columnsCount"
          :key="col"
          :class="['tab', { 'active-tab': activeColumn === col - 1 }]"
          @click="selectTab(col - 1)"
        >
          {{ $t('EDITOR.COLUMN') }} {{ col }}
        </div>
      </div>

      <div class="add-columns-wrapper">
        <!-- Eliminar columna -->
        <button v-if="columnsCount > 1" class="add-column-button mdi mdi-minus" @click="removeColumn"></button>

        <!-- Añadir columna -->
        <button v-if="columnsCount < 4" class="add-column-button mdi mdi-plus" @click="addColumn"></button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.column-tabs-container {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
}

.properties-title {
  padding: 4px 0;
}

.column-tabs {
  display: flex;
  margin-bottom: 0;
  border-bottom: 1px solid #ddd;
}

.tab {
  padding: 8px 12px;
  font-size: 12px;
  font-weight: bold;
  color: #666;
  cursor: pointer;
  position: relative;
  transition: color 0.3s ease;
}

.tab:hover {
  color: #333;
}

.active-tab {
  color: #333;
}

.active-tab::after {
  content: '';
  position: absolute;
  bottom: -1px;
  left: 0;
  right: 0;
  height: 2px;
  background-color: #333;
}

.add-columns-wrapper {
  display: flex;
  gap: 8px;
}

.add-column-button {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: none;
  background-color: rgb(244, 244, 244);
  color: black;
  font-size: 18px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.add-column-button:hover {
  background-color: rgb(230, 230, 230);
}
</style>
