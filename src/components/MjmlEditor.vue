<template>
  <div class="wrapper">
    <div>
      <button @click="clearMjmlBlock">Limpiar Lienzo</button>
      <div class="canvas">
        <div
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          :class="['row', { 'row-selected': row.isSelected }]"
          @click="selectRow(rowIndex)"
        >
          <!-- Renderizado dinámico de columnas -->
          <div v-if="row.columns.length === 1" class="single-column" @dragover.prevent @drop="onDrop(rowIndex, 0)">
            <div v-if="row.columns[0].content" v-html="row.columns[0].content"></div>
            <p v-else>1 Column selected</p>
          </div>
          <div v-else class="two-columns">
            <div class="column" @dragover.prevent @drop="onDrop(rowIndex, 0)">
              <div v-if="row.columns[0].content" v-html="row.columns[0].content"></div>
              <p v-else>Columna 1</p>
            </div>
            <div class="column" @dragover.prevent @drop="onDrop(rowIndex, 1)">
              <div v-if="row.columns[1].content" v-html="row.columns[1].content"></div>
              <p v-else>Columna 2</p>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="lateral-panel">
      <button class="column-button" @click="setColumns(1)"> 100% </button>
      <button class="column-button" @click="setColumns(2)"> 2*50% </button>
      <div class="tool-panel">
        <div class="draggable-item" draggable="true" @dragstart="onDragStart" data-type="button">Arrastra MJ-Button</div>
        <div class="draggable-item" draggable="true" @dragstart="onDragStart" data-type="text">Arrastra Texto MJML</div>
      </div>
    </div>
  </div>
</template>

<script>
import mjml2html from 'mjml-browser'

export default {
  data () {
    return {
      selectedRowIndex: null, // Almacena el índice de la fila seleccionada
      dragItemType: null,
      rows: [
        {
          isSelected: false,
          columns: [{ content: '' }] // Definimos columnas con contenido vacío
        },
        {
          isSelected: false,
          columns: [{ content: '' }] // Definimos columnas con contenido vacío
        }
      ]
    }
  },
  methods: {
    onDragStart (event) {
      this.dragItemType = event.target.getAttribute('data-type') // Obtiene el tipo de MJML a insertar
      console.log('Arrastrando: ' + this.dragItemType)
    },
    onDrop (rowIndex, columnIndex) {
  if (!this.dragItemType) return

  // Define el bloque MJML a insertar basado en el tipo arrastrado
  let mjmlContent = ''
  if (this.dragItemType === 'button') {
    mjmlContent = `
      <mj-button>
        ¡Botón MJML!
      </mj-button>
    `
  } else if (this.dragItemType === 'text') {
    mjmlContent = `
      <mj-text>
        ¡Texto MJML insertado!
      </mj-text>
    `
  }

  // Renderiza el MJML a HTML
  const { html } = mjml2html(`
    <mjml>
      <mj-body>
        <mj-section>
          <mj-column>
            ${mjmlContent}
          </mj-column>
        </mj-section>
      </mj-body>
    </mjml>
  `)

  // Concatenar el nuevo contenido al existente en la columna
  const existingContent = this.rows[rowIndex].columns[columnIndex].content || ''
  this.rows[rowIndex].columns[columnIndex].content = existingContent + html

  // Reseteamos el tipo arrastrado
  this.dragItemType = null
},
    clearMjmlBlock () {
      // Limpiamos todas las filas
      this.rows = this.rows.map(row => ({
        isSelected: false,
        columns: [{ content: '' }] // Reiniciar columnas vacías
      }))
      this.selectedRowIndex = null
    },
    selectRow (index) {
      // Deseleccionamos todas las filas primero
      this.rows.forEach((row, i) => {
        row.isSelected = i === index
      })

      // Actualizamos el índice de la fila seleccionada
      this.selectedRowIndex = index
      console.log(`Fila ${index + 1} seleccionada`)
    },
    setColumns (numColumns) {
      if (this.selectedRowIndex === null) {
        console.log('Por favor, selecciona una fila primero.')
        return
      }

      // Actualiza el número de columnas de la fila seleccionada
      if (numColumns === 1) {
        this.rows[this.selectedRowIndex].columns = [{ content: '' }] // Una columna vacía
      } else if (numColumns === 2) {
        this.rows[this.selectedRowIndex].columns = [{ content: '' }, { content: '' }] // Dos columnas vacías
      }

      console.log(`Fila ${this.selectedRowIndex + 1}: ${numColumns} columnas seleccionadas`)
    }
  }
}
</script>

<style scoped>

.wrapper {
  display: grid;
  grid-template-columns: 3fr 1fr;
}
/* Estilos para el lienzo */
.canvas {
  border: 1px solid #ddd;
  padding: 20px;
  margin-top: 10px;
  min-height: 70vh;
  min-width: 70%;
}

.row {
border: 1px dashed #1e90ff; /* Borde punteado */
background-color: #e6f2fb;  /* Azul claro */
padding: 20px;
text-align: center;
cursor: pointer;
}

.row-selected {
border: 1px solid #1e3a8a; /* Borde sólido azul oscuro */
background-color: #dbeafe;  /* Azul más oscuro */
}

.row p {
color: #1e90ff;
margin: 0;
}

.single-column {
display: flex;
justify-content: center;
align-items: center;
height: 100px;
border: 1px solid #ccc;
}

.two-columns {
display: flex;
justify-content: space-between;
gap: 10px;
}

.column {
width: 48%; /* Ocupa aproximadamente la mitad del ancho del contenedor */
background-color: #f0f0f0;
border: 1px solid #ccc;
display: flex;
justify-content: center;
align-items: center;
height: 100px;
}

.single-column, .column {
border: 1px dashed #ccc;
height: 100px;
display: flex;
align-items: center;
justify-content: center;
}

.column p {
margin: 0;
}

.draggable-item {
padding: 10px;
background-color: #f0f0f0;
border: 1px solid #ccc;
margin-bottom: 10px;
cursor: grab;
}

.lateral-panel {
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 16px;
  padding: 12px;
  padding-top: 36px;
  margin-bottom: 16px;
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

.single-column, .column {
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px; /* Agrega un padding para separar el contenido del borde */
  height: auto; /* Deja que la altura se ajuste automáticamente */
  flex-direction: column; /* Asegura que los elementos se apilen verticalmente */
  width: 100%; /* Asegura que el contenido ocupe todo el ancho */
}

</style>

