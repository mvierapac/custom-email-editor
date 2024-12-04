<template>
    <button class="add-row-button" @click.stop="emitAddRow">
      <!-- review change for bbva-icon -->
      +
    </button>
  </template>
  
  <script>
  export default {
    data() {
      return {
      };
    },
    methods: {
      emitAddRow() {
        this.$emit('add-row');
      },
    }
  };
  </script>
  
  <style scoped>
    .add-row-button {
      position: absolute;
      display: flex;
      align-items: end;
      justify-content: center;
      left: calc(50% - 50px);
      bottom: -20px;
      z-index: 100;
      width: 100px;
      height: 20px;
      background-color: #1464A5;
      color: #fff;
      cursor: pointer;
    }
  </style>
  