<script setup>
const props = defineProps({
  disableUndo: Boolean,
  disableRedo: Boolean,
});

const emit = defineEmits(['show-preview', 'undo', 'redo', 'clear-canvas']);

const emitEvent = (eventName) => {
  emit(eventName);
};
</script>

<template>
  <div class="header-panel">
    <v-tooltip content-class="tooltip" location="bottom">
      <template #activator="{ props }">
        <button class="header-panel-button mdi mdi-eye" v-bind="props" @click="emitEvent('show-preview')"></button>
      </template>
      <span>{{ $t('COMMON.PREVIEW') }}</span>
    </v-tooltip>

    <v-tooltip content-class="tooltip" location="bottom">
      <template #activator="{ props }">
        <button
          class="header-panel-button mdi mdi-undo"
          :class="{ 'icon-disabled': disableUndo }"
          v-bind="props"
          @click="emitEvent('undo')"
        ></button>
      </template>
      <span>{{ $t('COMMON.UNDO') }}</span>
    </v-tooltip>

    <v-tooltip content-class="tooltip" location="bottom">
      <template #activator="{ props }">
        <button
          class="header-panel-button mdi mdi-redo"
          :class="{ 'icon-disabled': disableRedo }"
          v-bind="props"
          @click="emitEvent('redo')"
        ></button>
      </template>
      <span>{{ $t('COMMON.REDO') }}</span>
    </v-tooltip>

    <v-tooltip content-class="tooltip" location="bottom">
      <template #activator="{ props }">
        <button class="header-panel-button mdi mdi-delete" v-bind="props" @click="emitEvent('clear-canvas')"></button>
      </template>
      <span>{{ $t('COMMON.RESET') }}</span>
    </v-tooltip>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixins.scss';

.header-panel {
  display: flex;
  justify-content: end;
  border: solid 1px #ddd;
  border-bottom: none;
  background-color: #ffff;
}

.header-panel-button {
  font-size: 20px;
  min-width: 50px;
  height: 40px;
  background-color: rgb(255, 255, 255);
  color: $core-blue;
  cursor: pointer;
}

.header-panel-button:hover {
  background-color: rgb(244, 244, 244);
}

.icon-disabled {
  opacity: 0.4;
  cursor: default;
}
</style>
