<template>
    <div class="tool-panel">
      <div 
        class="draggable-tool" 
        draggable="true" 
        @dragstart="startDrag('button', '#1973b8')"
      >
        <img src="../../assets/tools-imgs/button_blue.png" alt="btn-blu">
        <p>Button Blue</p>
      </div>
      <div 
        class="draggable-tool" 
        draggable="true" 
        @dragstart="startDrag('button', '#004481')"
      >
        <img src="../../assets/tools-imgs/dark_blue.png" alt="btn-blu">
        <p>Button Dark</p>
      </div>
      <div 
        class="draggable-tool" 
        draggable="true" 
        @dragstart="startDrag('button', '#028484')"
      >
        <img src="../../assets/tools-imgs/aqua.png" alt="btn-blu">
        <p>Button Aqua</p>
      </div>

      <div 
        class="draggable-tool" 
        draggable="true" 
        @dragstart="startDrag('text', '#1973b8')"
      >
         Texto 
      </div>
      <div 
        class="draggable-tool" 
        draggable="true" 
        @dragstart="startDrag('image')"
      >
        Image
      </div>
      <div 
        class="draggable-tool" 
        draggable="true" 
        @dragstart="startDrag('custom-column')"
      >
        Custom Column
      </div>

      <div 
        class="draggable-tool" 
        draggable="true" 
        @dragstart="startDrag('footer')"
      >
        Footer
      </div>
    </div>
  </template>
  
  <script>
  export default {
    methods: {
      startDrag(type, btnColor = null) {
        this.$emit('drag-start', type, btnColor);
      }
    }
  };
  </script>
  
  <style scoped>
    .tool-panel {
        margin-top: 16px;
        margin-bottom: 16px;
        width: 100%;
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
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
        min-width: 98px;
        max-width: 98px;
        height: 100px;
        line-height: 20px;
        text-align: center;
        font-size: 12px;
        font-weight: 500;
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
        padding-bottom: 0;
    }

    .draggable-tool > img {
        width: 100%;
        margin: 0 auto;
        flex-shrink: 0; /* Mantiene la imagen en su tamaño */
    }

    .draggable-tool > p {
        margin-top: auto; /* Empuja el párrafo hacia la parte inferior */
        margin-bottom: 8px; /* Espacio inferior del párrafo */
    }

    .draggable-tool:hover {
        box-shadow: rgba(0, 0, 0, 0.17) -2px 7px 20px;
        border: 1px solid rgb(238, 238, 238);
    }
  </style>
  