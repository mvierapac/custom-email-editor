<template>
    <div class="column-tabs-container">
      <div class="column-tabs">
        <div
          v-for="col in columnsCount"
          :key="col"
          :class="['tab', { 'active-tab': activeColumn === col - 1 }]"
          @click="selectTab(col - 1)"
        >
          Column {{ col }}
        </div>
      </div>
      
      <div class="add-columns-wrapper">
        <!-- Botón para eliminar columnas -->
        <button 
            v-if="columnsCount > 1" 
            class="add-column-button" 
            @click="removeColumn"
        >
            -
        </button>        
        <!-- Botón para agregar columnas -->
        <button 
            v-if="columnsCount < 4" 
            class="add-column-button" 
            @click="addColumn"
        >
            +
        </button>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    props: {
      columnsCount: {
        type: Number,
        required: true
      },
      activeColumn: {
        type: Number,
        required: true
      }
    },
    methods: {
      selectTab(columnIndex) {
        this.$emit('column-selected', columnIndex);
      },
      addColumn() {
        this.$emit('add-column', this.columnsCount + 1 );
      },
      removeColumn () {
        this.$emit('remove-column', this.columnsCount - 1 );
      }
    }
  };
  </script>
  
  <style scoped>

.column-tabs-container {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 8px;
}
  .column-tabs {
    display: flex;
    margin-bottom: 0;
    border-bottom: 1px solid #ddd;
  }
  
  .tab {
    padding: 8px 12px;
    font-size: 12px;
    font-weight: bold;
    color: #666;
    cursor: pointer;
    position: relative;
    transition: color 0.3s ease;
  }
  
  .tab:hover {
    color: #333;
  }
  
  .active-tab {
    color: #333;
  }
  
  .active-tab::after {
    content: "";
    position: absolute;
    bottom: -1px;
    left: 0;
    right: 0;
    height: 2px;
    background-color: #333;
  }

  .add-columns-wrapper {
    display: flex;
    gap: 8px;
  }

  /* Review cuando se pase a mailing */
    .add-column-button {
        width: 30px;
        height: 30px;
        border-radius: 50%;
        border: none;
        background-color: rgb(244, 244, 244);
        color: black;
        font-size: 18px;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        transition: background-color 0.3s ease;
    }

    .add-column-button:hover {
        background-color: rgb(230, 230, 230);
    }
  </style>
  