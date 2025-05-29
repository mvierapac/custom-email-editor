<script setup>
const props = defineProps({
  disableSave: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['exit', 'save', 'saveAndExit']);

const emitEvent = (eventName) => {
  emit(eventName);
};
</script>

<template>
  <div class="row-btns u-margin-bottom-medium">
    <button class="btn-link btn-link--transparent" @click="emitEvent('exit')">
      {{ $t('COMMON.EXIT') }}
    </button>

    <button class="btn-basic" @click="emitEvent('save')" :class="{ 'btn-basic--disabled': disableSave }">
      {{ $t('COMMON.SAVE') }}
    </button>

    <button class="btn-basic" @click="emitEvent('saveAndExit')" :class="{ 'btn-basic--disabled': disableSave }">
      {{ $t('COMMON.SAVE_AND_EXIT') }}
    </button>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixins.scss';

.row-btns {
  margin-top: 12px;

  & > :not(:last-child) {
    margin-right: 24px;
  }
}
</style>
