<template>
    <div class="configure-columns-panel">

   <!--  Review: Borrar       
        <button class="column-button" @click="emitConfigureColumns(1)"> 100% </button>
        <button class="column-button" @click="emitConfigureColumns(2)"> 2*50% </button>
        <button class="column-button" @click="emitConfigureColumns(2, [67, 33])"> 67 / 33 </button>
        <button class="column-button" @click="emitConfigureColumns(2, [33, 67])"> 33 / 67 </button>
        <button class="column-button" @click="emitConfigureColumns(3)"> 33*3 </button>
        <button class="column-button" @click="emitConfigureColumns(4)"> 25*4 </button> 
      -->
        

        <!-- boton 100% -->
        <div style="width: calc(50% - 8px);">
            <div class="set-columns-tool set-columns-tool-selected">
                <button class="set-columns-buttons" style="flex: 0 0 100%;" @click="emitConfigureColumns(1)">
                    <div class="set-columns-content">100%</div>
                </button>
            </div>
        </div>         
        <!-- boton 50/50 -->
        <div style="width: calc(50% - 8px);">
            <div class="set-columns-tool set-columns-tool-selected">
                <button class="set-columns-buttons" style="flex: 0 0 50%;" @click="emitConfigureColumns(2)">
                    <div class="set-columns-content">50%</div>
                </button>
                <button class="set-columns-buttons" style="flex: 0 0 50%;" @click="emitConfigureColumns(2)">
                    <div class="set-columns-content">50%</div>
                </button>
            </div>
        </div>

        <!-- boton 33/67 -->
        <div style="width: calc(50% - 8px);">
            <div class="set-columns-tool set-columns-tool-selected">
                <button class="set-columns-buttons" style="flex: 0 0 33%;" @click="emitConfigureColumns(2, [33, 67])">
                    <div class="set-columns-content">33%</div>
                </button>
                <button class="set-columns-buttons" style="flex: 0 0 67%;" @click="emitConfigureColumns(2, [33, 67])">
                    <div class="set-columns-content">67%</div>
                </button>
            </div>
        </div>

        <!-- boton 67/33 -->
        <div style="width: calc(50% - 8px);">
            <div class="set-columns-tool set-columns-tool-selected">
                <button class="set-columns-buttons" style="flex: 0 0 67%;" @click="emitConfigureColumns(2, [67, 33])">
                    <div class="set-columns-content">67%</div>
                </button>
                <button class="set-columns-buttons" style="flex: 0 0 33%;" @click="emitConfigureColumns(2, [67, 33])">
                    <div class="set-columns-content">33%</div>
                </button>
            </div>
        </div>
        
        <!-- boton 33/33/33 -->
        <div style="width: calc(50% - 8px);">
            <div class="set-columns-tool set-columns-tool-selected">
                <button class="set-columns-buttons" style="flex: 0 0 33%;" @click="emitConfigureColumns(3)">
                    <div class="set-columns-content">33%</div>
                </button>
                <button class="set-columns-buttons" style="flex: 0 0 33%;" @click="emitConfigureColumns(3)">
                    <div class="set-columns-content">33%</div>
                </button>
                <button class="set-columns-buttons" style="flex: 0 0 33%;" @click="emitConfigureColumns(3)">
                    <div class="set-columns-content">33%</div>
                </button>
            </div>
        </div>

        <!-- boton 25/25/25/25 -->
        <div style="width: calc(50% - 8px);">
            <div class="set-columns-tool set-columns-tool-selected">
                <button class="set-columns-buttons" style="flex: 0 0 25%;" @click="emitConfigureColumns(4)">
                    <div class="set-columns-content">25%</div>
                </button>
                <button class="set-columns-buttons" style="flex: 0 0 25%;" @click="emitConfigureColumns(4)">
                    <div class="set-columns-content">25%</div>
                </button>
                <button class="set-columns-buttons" style="flex: 0 0 25%;" @click="emitConfigureColumns(4)">
                    <div class="set-columns-content">25%</div>
                </button>
                <button class="set-columns-buttons" style="flex: 0 0 25%;" @click="emitConfigureColumns(4)">
                    <div class="set-columns-content">25%</div>
                </button>
            </div>
        </div>
    </div>
  </template>
  
  <script>
  export default {
    data () {
      return {
      }
    },
    methods: {
      emitConfigureColumns (numColumns, proportions = []) {
        this.$emit('configure-columns', numColumns, proportions)
      }
    }
  }
  </script>
  
  <style scoped>
  .configure-columns-panel {
    display:  flex;
    gap: 8px;
    flex-wrap: wrap;
    justify-content: space-between;
    align-items: flex-start;
  }
  
  .column-button {
    width: 45%;
    padding: 10px 15px;
    font-size: 16px;
    background-color: #d3d3d3;
    color: black;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
  }
  
  .column-button:hover {
    background-color: #a9a9a9;
  }

  .set-columns-tool {
    display: flex;
    height: 40px;
    padding: 0px;
    background-color: rgb(255, 255, 255);
    border-radius: 2px;
}

.set-columns-tool:hover .set-columns-buttons {
    background-color: rgb(255, 255, 255); /* Color de fondo de hover para ambos botones */
}

.set-columns-tool .set-columns-buttons {
    position: relative;
    height: 100%;
    padding: 0px;
    border: none;
    cursor: pointer;
    overflow: hidden;
    background-color: rgb(244, 244, 244);
    box-shadow: rgb(212, 212, 212) 0px 0px 0px 1px;
    transition: background-color 0.3s ease;
}

.set-columns-tool .set-columns-buttons:first-child {
    border-top-left-radius: 2px;
    border-bottom-left-radius: 2px;
}

.set-columns-tool .set-columns-buttons:last-child {
    border-top-right-radius: 2px;
    border-bottom-right-radius: 2px;
}

.set-columns-content {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    text-align: center;
    font-size: 12px;
    color: rgb(81, 81, 81);
}

  </style>
  