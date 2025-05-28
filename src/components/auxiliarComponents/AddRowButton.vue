<script setup>
const emit = defineEmits(['add-row']);

const emitAddRow = () => {
  emit('add-row');
};
</script>

<template>
  <v-tooltip content-class="tooltip" location="bottom">
    <template #activator="{ props }">
      <button class="add-row-button mdi mdi-plus" v-bind="props" @click.stop="emitAddRow" />
    </template>
    <span>{{ $t('EDITOR.ADD_ROW') }}</span>
  </v-tooltip>
</template>

<style scoped>
.add-row-button {
  position: absolute;
  display: flex;
  align-items: end;
  justify-content: center;
  left: calc(50% - 50px);
  bottom: -20px;
  z-index: 1;
  width: 100px;
  height: 20px;
  background-color: #1464a5;
  color: #fff;
  font-size: 20px;
  cursor: pointer;
}
</style>
