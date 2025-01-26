<template>
    <div class="header-panel">
      <!-- review disable icons undo and redo -->
      <v-tooltip content-class="tooltip" location="bottom">
          <template v-slot:activator="{ props }">
            <button class="header-panel-button mdi mdi-eye" v-bind="props" @click="emitEvent('show-preview')"></button>
          </template>
          <span>{{ $t('COMMON.PREVIEW') }}</span>
      </v-tooltip>

      <v-tooltip content-class="tooltip" location="bottom">
          <template v-slot:activator="{ props }">
            <button class="header-panel-button mdi mdi-undo" v-bind="props" @click="emitEvent('undo')"></button>
          </template>
          <span>{{ $t('COMMON.UNDO') }}</span>
      </v-tooltip>

      <v-tooltip content-class="tooltip" location="bottom">
          <template v-slot:activator="{ props }">
            <button class="header-panel-button mdi mdi-redo" v-bind="props" @click="emitEvent('redo')"></button>
          </template>
          <span>{{ $t('COMMON.REDO') }}</span>
      </v-tooltip>      

      <v-tooltip content-class="tooltip" location="bottom">
          <template v-slot:activator="{ props }">
            <button class="header-panel-button mdi mdi-delete" v-bind="props" @click="emitEvent('clear-canvas')"></button>
          </template>
          <span>{{ $t('COMMON.RESET') }}</span>
      </v-tooltip> 

    </div>
  </template>
  
  <script>
  export default {
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
      color: $bbva-core-blue;
      cursor: pointer;
    }
    .header-panel-button:hover {
      background-color: rgb(244, 244, 244);
    }
  </style>
  