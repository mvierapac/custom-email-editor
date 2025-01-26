<template>
    <div>
      <button class="collapsable-panel-button" @click="handleExpandBtn">
        <p>Filas prediseñadas</p>
        <i class="mdi mdi-chevron-up" v-if="expanded"></i>
        <i class="mdi mdi-chevron-down" v-else></i>
      </button>
      <div class="tool-panel lateral-panel-section-padding" v-if="expanded">
        <div>
          <div class="tool-panel__group">
            <div 
              class="draggable-tool" 
              draggable="true" 
              @dragstart="startDrag('threeSeven')"
            >
              <img src="_editor/images/three-seven.png" class="filter-invert" alt="3/7">
              <p>3/7</p>
            </div>
            <div 
              class="draggable-tool" 
              draggable="true" 
              @dragstart="startDrag('sevenThree')"
            >
              <img src="_editor/images/seven-three.png" class="filter-invert" alt="7/3">
              <p>7/3</p>
            </div>
            <div 
              class="draggable-tool" 
              draggable="true" 
              @dragstart="startDrag('two-column')"
            >
            <img src="_editor/images/two_column.png" class="filter-invert fit-content" :style="{'max-width': '70%'}" alt="two column">
              <p>2 columnas</p>
            </div>
            <div 
              class="draggable-tool" 
              draggable="true" 
              @dragstart="startDrag('three-column')"
            >
            <img src="_editor/images/three_column.png" class="filter-invert fit-content" :style="{'max-width': '80%'}" alt="three column">
              <p>3 columnas</p>
            </div>            
          </div>
        </div>  
      </div>
    </div>
  </template>
  
  <script>
  export default {
    data() {
      return {
        expanded: true,
      };
    },
    methods: {
      handleExpandBtn () {
        this.expanded = !this.expanded
      },
      startDrag(type, btnColor = null) {
        this.$emit('drag-start', type, btnColor);
      }
    }
  };
  </script>
  
  <style  lang="scss" scoped>
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
        transition: box-shadow 0.1s, transform 0.05s ease-in;
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

    .filter-invert {
      filter: invert(1) brightness(0.5);
    }

    .fit-content {
      max-width: fit-content;
    }

    .collapsable-panel-button {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 12px;
      justify-content: space-between;
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
  