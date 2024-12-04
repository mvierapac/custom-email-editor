<template>
    <div class="header-panel">
      <!-- review change for bbva-icon -->
      <!-- review disable icons undo and redo -->
      <button class="header-panel-button" @click="emitEvent('show-preview')">
        <i class="mdi mdi-eye"></i>
      </button>
      <button class="header-panel-button" @click="emitEvent('undo')">
        <i class="mdi mdi-undo"></i>
      </button>
      <button class="header-panel-button" @click="emitEvent('redo')">
        <i class="mdi mdi-redo"></i>
      </button>
      <button class="header-panel-button" @click="emitEvent('clear-canvas')">
        <i class="mdi mdi-delete"></i>
      </button>
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
  
  <style scoped>
    .header-panel {
      display: flex;
      justify-content: end;
      border: solid 1px #ddd;
      border-bottom: none;
    }
    .header-panel-button {
      font-size: 20px;
      min-width: 50px;
      height: 40px;
      background-color: rgb(255, 255, 255);
      color: rgb(0, 0, 0);
      cursor: pointer;
    }
    .header-panel-button:hover {
      background-color: rgb(244, 244, 244);
    }
  </style>
  