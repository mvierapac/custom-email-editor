<template>
  <div class="wrapper">
    <div>
      <button @click="clearMjmlBlock">Limpiar Lienzo</button>
      <div class="canvas" ref="editorContainer">
        <div
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          :class="['row', { 'row-selected': row.isSelected }]"
          @click="selectRow(rowIndex)"
        >
          <!-- Renderizado dinámico de columnas -->
          <div v-if="row.columns.length === 1" class="single-column" @dragover.prevent @drop="onDrop(rowIndex, 0)" @click="handleBlockClick($event)">
            <div v-if="row.columns[0].content" v-html="row.columns[0].content"></div>
            <p v-else>1 Column selected</p>
          </div>
          <div v-else class="two-columns">
            <div class="column" @dragover.prevent @drop="onDrop(rowIndex, 0)" @click="handleBlockClick($event)">
              <div v-if="row.columns[0].content" v-html="row.columns[0].content"></div>
              <p v-else>Columna 1</p>
            </div>
            <div class="column" @dragover.prevent @drop="onDrop(rowIndex, 1)" @click="handleBlockClick($event)">
              <div v-if="row.columns[1].content" v-html="row.columns[1].content"></div>
              <p v-else>Columna 2</p>
            </div>
          </div>
        </div>
            <!-- Editor de texto enriquecido inline en el lienzo -->
        <InlineEditor
          v-if="editingText"
          :ckeditor="editingText"
          :initialContent="selectedTextContent"
          @updateContent="updateTextBlockContent"
        />
      </div>
    </div>
    <div class="lateral-panel">
      <button class="column-button" @click="setColumns(1)"> 100% </button>
      <button class="column-button" @click="setColumns(2)"> 2*50% </button>
      <div class="tool-panel">
        <div class="draggable-item" draggable="true" @dragstart="onDragStart" data-type="button">Arrastra MJ-Button</div>
        <div class="draggable-item" draggable="true" @dragstart="onDragStart" data-type="text">Arrastra Texto MJML</div>
        <div class="draggable-item" draggable="true" @dragstart="onDragStart" data-type="image">MJ-image</div>
      </div>
      <div class="properties-panel">
        <input type="text" v-model="buttonText" placeholder="Nuevo texto del botón" />
        <button class="property-btn" @click="updateButtonText(buttonText)">Actualizar texto del botón</button>
        <input type="text" v-model="buttonLink" placeholder="Link del botón" />
        <button class="property-btn" @click="updateButtonHref(buttonLink)">Actualizar href del botón</button>
        <div class="align-buttons">
          <button class="align-button" @click="updateButtonAlignment('left')">Izda</button>
          <button class="align-button" @click="updateButtonAlignment('center')">Centro</button>
          <button class="align-button" @click="updateButtonAlignment('right')">Drcha</button>
        </div>
      </div>

    </div>
  </div>
</template>

<script>
import mjml2html from 'mjml-browser'
import InlineEditor from './InlineEditor.vue'

export default {

  mounted () {
    // Intercepta todos los clics en enlaces dentro del editor
    console.log('mounted')
    this.$refs.editorContainer.addEventListener('click', this.preventLinkNavigation)
  },

  beforeUnmount () {
    // Elimina el listener al desmontar el componente
    this.$refs.editorContainer.removeEventListener('click', this.preventLinkNavigation)
  },

  components: {
    InlineEditor
  },
  data () {
    return {
      selectedRowIndex: null, // Almacena el índice de la fila seleccionada
      dragItemType: null,
      selectedBlock: null,
      buttonText: '',
      buttonLink: '',
      selectedTextContent: '',
      rows: [
        {
          isSelected: false,
          columns: [{ content: '' }] // Definimos columnas con contenido vacío
        },
        {
          isSelected: false,
          columns: [{ content: '' }] // Definimos columnas con contenido vacío
        }
      ],
      // CKEDITOR
      editingText: false,
      currentRow: null,
      currentColumn: null
    }
  },
  methods: {
    preventLinkNavigation (event) {
      const target = event.target.closest('a') // Verificamos si el clic fue en un enlace

      if (target && target.closest('.block-wrapper')) {
      // Si el enlace está dentro del editor (e.g., en un .block-wrapper), prevenimos la redirección
        event.preventDefault()
        console.log('Redirección prevenida en el editor.')
      }
    },

    onDragStart (event) {
      this.dragItemType = event.target.getAttribute('data-type') // Obtiene el tipo de MJML a insertar
      console.log('Arrastrando: ' + this.dragItemType)
    },
    onDrop (rowIndex, columnIndex) {
      if (!this.dragItemType) return

      let mjmlContent = ''
      const blockId = `${this.dragItemType}-${Date.now()}`

      // Generamos el MJML según el tipo de bloque
      if (this.dragItemType === 'button') {
        mjmlContent = `
          <mj-button css-class="${blockId}" text-decoration="none" href="javascript:void(0);" background-color="#1973b8" color="white" editable="true" border-radius="1px" inner-padding="12px 32px">
            Botón
          </mj-button>
        `
      } else if (this.dragItemType === 'text') {
        mjmlContent = `
          <mj-text css-class="${blockId}">
            ¡Texto MJML insertado!
          </mj-text>
        `
      }

      // Convertir MJML a HTML
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

      // Envolver el HTML en un contenedor que sea clickeable
      const wrappedHtml = `
        <div class="block-wrapper" data-block-id="${blockId}" @click="handleBlockClick">
          ${html}
        </div>
      `

      // Actualizamos el contenido de la columna con el contenedor envuelto
      this.rows[rowIndex].columns[columnIndex].content = wrappedHtml

      // Reseteamos el tipo de bloque arrastrado
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
      const clickedElement = event.target.closest('.block-wrapper') // Detecta si el clic fue en un bloque

      if (clickedElement) {
        // Si el clic fue en un bloque, no seleccionamos la fila
        return
      }
      // Deseleccionamos todas las filas primero
      this.rows.forEach((row, i) => {
        row.isSelected = i === index
      })

      // Deseleccionar bloque
      this.removeHighlightBlock()
      this.selectedBlock = null

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
    },
    handleBlockClick (event) {
      // event.stopPropagation();  // Evitamos que el clic en el bloque seleccione la fila

      const blockHandler = event.target.closest('.block-wrapper') // Selecciona el contenedor más cercano

      if (blockHandler) {
        const blockId = blockHandler.getAttribute('data-block-id')
        const isText = blockId.includes('text')
        console.log('Contenedor seleccionado, ID:', blockId)
        console.log('isText', isText)


        // Deseleccionamos todas las filas primero
        this.rows.forEach((row, i) => {
          row.isSelected = false
        })

        // Resaltar el contenedor seleccionado
        this.highlightBlock(blockHandler)
        this.selectedBlock = blockHandler

        // CKEDITOR TEST
        if (isText) {
          this.currentRow = this.getRowIndexFromBlockId(blockId)
          this.currentColumn = this.getColumnIndexFromBlockId(blockId)
          const textContainer = blockHandler.querySelector(`.${blockId}`);
          const textElement = textContainer.querySelector('div, p');
          this.selectedTextContent = textElement.innerHTML;
          this.editingText = true
        } else {
          this.editingText = false
        }

        // Prevenir redirección si el clic es en un enlace
        const targetAnchor = blockHandler.querySelector('a')
        if (targetAnchor) {
          event.preventDefault() // Evita la redirección
        }
      }
    },
    removeHighlightBlock () {
      // Remover el resaltado de otros bloques
      document.querySelectorAll('.block-wrapper').forEach(block => {
        block.classList.remove('selected-block')
      })      
    },
    highlightBlock (blockHandler) {
      // Remover el resaltado de otros bloques
      this.removeHighlightBlock()

      // Añadir el resaltado al bloque seleccionado
      blockHandler.classList.add('selected-block')
    },

    updateButtonText (newText) {
      if (this.selectedBlock) {
      // Buscamos el mj-button dentro del bloque seleccionado
        console.log(this.selectedBlock)
        const button = this.selectedBlock.querySelector('a')

        if (button) {
        // Cambiamos el texto del botón
          button.innerHTML = newText

          console.log('Texto del botón actualizado a:', newText)
        } else {
          console.log('No se encontró un botón en el bloque seleccionado.')
        }
      }
    },
    updateButtonHref (newHref) {
      if (this.selectedBlock) {
      // Buscamos el <a> dentro del botón seleccionado
        const buttonAnchor = this.selectedBlock.querySelector('a')

        if (buttonAnchor) {
        // Cambiamos el atributo href
          buttonAnchor.setAttribute('href', newHref)

          // Prevenir el comportamiento de redirección en el editor
          buttonAnchor.addEventListener('click', (event) => {
            event.preventDefault()
          })

          console.log('Href del botón actualizado a:', newHref)
        } else {
          console.log('No se encontró un <a> en el bloque seleccionado.')
        }
      } else {
        console.log('No hay bloque seleccionado.')
      }
    },
    updateButtonAlignment (alignment) {
      if (this.selectedBlock) {
      // En este caso actuamos sobre el bloque en sí
        console.log(this.selectedBlock)

        const blockId = this.selectedBlock.getAttribute('data-block-id')
        // Buscar el descendiente con la clase del blockId
        const targetElement = this.selectedBlock.querySelector(`.${blockId}`)
        if (targetElement) {
          targetElement.style.textAlign = `-webkit-${alignment}`
          console.log(`Alineación del botón actualizada a: ${alignment}`)
        } else {
          console.log(`No se encontró un descendiente con la clase .${blockId}`)
        }
      }
    },
    editText (rowIndex, columnIndex) {
      this.currentRow = rowIndex
      this.currentColumn = columnIndex
      this.editingText = true
    },
    updateTextBlockContent(newContent) {
    console.log('newcontent', newContent);

    // Ajusta el contenido de <p> para que todos tengan margin: 0
      const adjustedContent = newContent.replace(/<p(\s+[^>]*)?>/g, (match, attrs) => {
      if (attrs && attrs.includes('style=')) {
        // Si ya existe un estilo, añade margin: 0 dentro del style actual
        return match.replace(/style="([^"]*)"/, 'style="$1 margin: 0;"');
      } else {
        // Si no tiene estilo, añade uno con margin: 0
        return `<p style="margin: 0;"${attrs || ''}>`;
      }
    });

    console.log(adjustedContent)
    // Accede al contenido actual de la fila y columna seleccionadas
    const currentContent = this.rows[this.currentRow].columns[this.currentColumn].content;

    // Crear un contenedor temporal para manipular el contenido HTML
    const tempContainer = document.createElement('div');
    tempContainer.innerHTML = currentContent;

    // Selecciona el div objetivo dentro del contenido actual usando la clase dinámica
    const blockId = this.selectedBlock.getAttribute('data-block-id');
    const targetDiv = tempContainer.querySelector(`.${blockId} div`);

    if (targetDiv) {
      // Actualiza solo el contenido de texto en el div sin modificar la estructura
      targetDiv.innerHTML = adjustedContent;

      // Guarda el contenido actualizado en la estructura de datos del editor
      this.rows[this.currentRow].columns[this.currentColumn].content = tempContainer.innerHTML;
    } else {
      console.log("No se encontró el div objetivo para actualizar el contenido.");
    }

    // Detiene la edición después de actualizar el texto
    // this.editingText = false;
  },
    // Métodos adicionales para encontrar la fila y columna de un bloque dado su blockId
    getRowIndexFromBlockId (blockId) {
      for (let i = 0; i < this.rows.length; i++) {
        if (this.rows[i].columns.some(column => column.content.includes(blockId))) {
          return i
        }
      }
      return null
    },
    getColumnIndexFromBlockId (blockId) {
      const rowIndex = this.getRowIndexFromBlockId(blockId)
      if (rowIndex !== null) {
        return this.rows[rowIndex].columns.findIndex(column => column.content.includes(blockId))
      }
      return null
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
display: block;
width: 100%;
/* justify-content: center;
align-items: center; */
height: 100px;
border: 1px solid #ccc;
}

.single-column > div {
  /* Estilos para el div hijo directo de .single-column */
  width: 100%;
  max-width: 600px;
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

.column > div {
  width: 100%;
  max-width: 600px;
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
  box-sizing: border-box;
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid #ccc;
  padding: 10px; /* Agrega un padding para separar el contenido del borde */
  height: auto; /* Deja que la altura se ajuste automáticamente */
  flex-direction: column; /* Asegura que los elementos se apilen verticalmente */
  width: 100%; /* Asegura que el contenido ocupe todo el ancho */
}

.block-wrapper {
  width: 100%;
  max-width: 600px;
  display: block;
  box-sizing: border-box;
  outline: none;
}

:deep(.selected-block) {
  outline: 2px solid #007bff;
  box-sizing: border-box;
}

.properties-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.align-buttons {
  margin-top: 16px;
  display: flex;
  gap: 12px;
}

.align-button {
  background-color: #e4c77be7;
}

</style>
