<template>
    <div class="row-btns u-margin-bottom-medium">
        <button class="btn-link btn-link--transparent" @click="emitEvent('exit')" >{{ $t('COMMON.EXIT') }}</button>
        <!-- <button
          v-if="showLoadTemplate"
          class="btn-link" 
          @click="emitEvent('load-template')" 
        >
          {{ $t('EDITOR.LOAD_TEMPLATE') }}
        </button> -->
        <button 
          class="btn-basic"  
          @click="emitEvent('save')"
          :class="{'btn-basic--disabled': disableSave}"
        >
            {{ $t('COMMON.SAVE') }}
        </button>
        <button 
          class="btn-basic" 
          @click="emitEvent('saveAndExit')"
          :class="{'btn-basic--disabled': disableSave}"
        >
          {{ $t('COMMON.SAVE_AND_EXIT') }}
        </button>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      disableSave: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
      };
    },
    methods: {
      emitEvent(eventName) {
        this.$emit(eventName);
      },
    }
  };
  </script>
  
  <style scoped lang="scss">
    @import '@/assets/scss/_variables.scss';
    @import '@/assets/scss/_mixins.scss';
    .row-btns {
      margin-top: 12px;;
      & > :not(:last-child) {
        margin-right: 24px;
      }
    }
  </style>
  