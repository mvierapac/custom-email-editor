<template>
  <div>
    <div class="actions-buttons">
      <button class="action-button" @click="clearCanvas">Limpiar Lienzo</button>
      <button class="action-button" @click="addRow">Add Row</button>
      <button class="action-button" @click="exportMJMLToHTML">Export html</button>
      <button class="action-button" @click="loadTemplate">Import Json</button>
    </div>
    <div class="wrapper">
      <div class="canvas" ref="editorContainer">
        <div
          v-for="(row, rowIndex) in rows"
          :key="rowIndex"
          :class="['row', { 'row-selected': row.isSelected }, {'z-index-row': this.selectedRowIndex === rowIndex}, getColumnClass(row.columns.length, row.columns[0].width)]"
          @click="selectRow(rowIndex)"
          @dragover.prevent="handleDragOverRow(rowIndex)"
          @drop="handleDropRow(rowIndex)"

        >
          <!-- Indicador de arrastre solo visible en la fila seleccionada -->
          <div
            v-if="row.isSelected"
            class="drag-handle"
            @mousedown.stop
            @dragstart="handleDragStartRow($event, rowIndex)"
            draggable="true"
          >
            <span class="drag-icon">⠿</span>
          </div>

          <!-- Panel de acciones de la fila -->
          <div
            v-if="row.isSelected"
            class="row-action-panel"
          >
            <div class="row-action-icon delete-icon" @click="handleDeleteRow(rowIndex)">
              🗑️
            </div>
            <div class="row-action-icon copy-icon" @click="handleDuplicateRow(rowIndex)">
              📄
            </div>
          </div>
          <!-- Renderización dinámica de columnas -->
          <div class="columns-container">
            <div
              v-for="(column, columnIndex) in row.columns"
              :key="columnIndex"
              class="column"
              :style="{
                backgroundColor: column.backgroundColor || '#f0f0f0',
                paddingTop: column.padding.top + 'px',
                paddingRight: column.padding.right + 'px',
                paddingBottom: column.padding.bottom + 'px',
                paddingLeft: column.padding.left + 'px',
                borderTop: `${column.border.width?.top}px solid ${column.border.color.top}`,
                borderRight: `${column.border.width?.right}px solid ${column.border.color.right}`,
                borderBottom: `${column.border.width?.bottom}px solid ${column.border.color.bottom}`,
                borderLeft: `${column.border.width?.left}px solid ${column.border.color.left}`
              }"
              :class="{'column-outlined': !column.content.length, 'column-min-height': !column.content.length}"
              @dragover.prevent
              @drop="addBlockToCanvas(rowIndex, columnIndex)"
            >
              <div  v-if="column.content.length">
                <BlockRenderer
                  v-for="(block, index) in column.content"
                  :key="block.blockId"
                  :block="block"
                  :isSelected ="selectedBlockId === block.blockId"
                  :showUpBtn="index !== 0 && column.content.length > 1"
                  :showDownBtn="index !== column.content.length-1"
                  @block-selected="handleBlockSelection"
                  @delete-block="handleDeleteBlock" 
                  @duplicate-block="handleDuplicateBlock"
                  @up-block="upBlock(index)"
                  @down-block="downBlock(index)"
                />
              </div>
            <p v-else>Columna {{ columnIndex + 1 }}</p>
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
    <div class="lateral-panel">
      <configure-columns-panel 
        @configure-columns="configureColumns"
      />

      <Tools-panel @drag-start="handleDragStart" />
      
      <!-- Review Eliminar después de componetizar si todo va bien -->
      <!-- <div class="tool-panel">
        <div class="draggable-item" draggable="true" @dragstart="onDragStart" data-type="button">Arrastra MJ-Button</div>
        <div class="draggable-item" draggable="true" @dragstart="onDragStart" data-type="text">Arrastra Texto MJML</div>
        <div class="draggable-item" draggable="true" @dragstart="onDragStart" data-type="image">MJ-image</div>
      </div> -->

      <ColumnTabs
        v-if="activeColumn !== null"
        :columnsCount="selectedRowColumns"
        :activeColumn="activeColumn"
        @column-selected="selectColumn"
        @add-column="configureColumns"
        @remove-column="configureColumns"
      />
      <!-- Herramientas y propiedades de columna -->
      <ColumnPropertiesPanel
        v-if="activeColumn !== null"
        :columnBackgroundColor="columnBackgroundColor"
        :columnPadding="rows[selectedRowIndex]?.columns[activeColumn]?.padding"
        :columnIndex="activeColumn"
        :columnBorderWidth="rows[selectedRowIndex]?.columns[activeColumn]?.border.width"
        :columnBorderColor="rows[selectedRowIndex]?.columns[activeColumn]?.border.color"
        @update-background-color="updateColumnBackgroundColor"
        @update-padding="updateColumnPadding"
        @update-border-width="updateColumnBorderWidth"
        @update-border-color="updateColumnBorderColor"
      />
      <ButtonPropertiesPanel
        v-if="selectedBlock && selectedBlock.type === 'button'"
        :buttonLink="selectedBlock.properties.href"
        :buttonText="selectedBlock.properties.text"
        :containerPadding="selectedBlock.properties.containerPadding"
        @update-button-href="updateButtonHref"
        @update-button-text="updateButtonText"
        @update-button-alignment="updateBlockAligment"
        @update-container-padding="updateContainerPadding"
      />
      <TextPropertiesPanel
        v-if="selectedBlock && (selectedBlock.type === 'text' || selectedBlock.type === 'texticon')"
        :containerPadding="selectedBlock.properties.containerPadding"
        @update-container-padding="updateContainerPadding"
      />
      <ImagePropertiesPanel
        v-if="selectedBlock && selectedBlock.type === 'image'"
        :imageLink="selectedBlock.properties.href"
        :imageWidth="selectedBlock.properties.width"
        :containerPadding="selectedBlock.properties.containerPadding"
        @update-container-padding="updateContainerPadding"
        @update-block-alignment="updateBlockAligment"
        @update-img-href="updateImageHref"
        @update-img-width="updateImageWidth"
      />

    </div>
  </div>
  </div>
</template>

<script>
import mjml2html from 'mjml-browser'
import InlineEditor from './InlineEditor.vue'

import ConfigureColumnsPanel from './lateralPanelComponents/ConfigureColumnsPanel.vue'
import ColumnPropertiesPanel from './lateralPanelComponents/ColumnPropertiesPanel.vue'
import ColumnTabs from './lateralPanelComponents/ColumnTabs.vue'
import ToolsPanel from './lateralPanelComponents/ToolsPanel.vue'
import ButtonPropertiesPanel from './lateralPanelComponents/ButtonPropertiesPanel.vue'
import TextPropertiesPanel from './lateralPanelComponents/TextPropertiesPanel.vue'
import ImagePropertiesPanel from './lateralPanelComponents/ImagePropertiesPanel.vue'

import BlockRenderer from './BlockRenderer.vue'

import {generateTextButtonStructure, generateFooterStructure, generateThreeSevenStructure, generateSevenThreeStructure, generateThreeSevenWithMarginStructure, generateSevenThreeWithMarginStructure } from '../generateBlocksFunctions'

export default {

  mounted () {
    // Intercepta todos los clics en enlaces dentro del editor
    this.$refs.editorContainer.addEventListener('click', this.preventLinkNavigation)
  },

  beforeUnmount () {
    // Elimina el listener al desmontar el componente
    this.$refs.editorContainer.removeEventListener('click', this.preventLinkNavigation)
  },

  components: {
    InlineEditor,
    BlockRenderer,
    ColumnPropertiesPanel,
    ConfigureColumnsPanel,
    ColumnTabs,
    ToolsPanel,
    ButtonPropertiesPanel,
    TextPropertiesPanel,
    ImagePropertiesPanel
  },
  data () {
    return {
      selectedColumnIndex: null,
      selectedBlockId: null,
      selectedRowIndex: null, // Almacena el índice de la fila seleccionada
      selectedRowColumns: 0,
      activeColumn: null, // Columna actualmente seleccionada en el panel
      selectedBlockRowIndex: null, // Fila del bloque seleccionado
      selectedBlockActiveColumn: null, // Columna del bloque seleccionado
      dragItemType: null,
      colorDraggedBtn: null,
      selectedBlock: null,
      columnBackgroundColor: '#f0f0f0',
      buttonText: '',
      buttonLink: '',
      selectedTextContent: '',
      rows: [
        {
          isSelected: false,
          columns: [{
            content: [],
            backgroundColor: '#f0f0f0',
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            border: {
              width: { top: 0, right: 0, bottom: 0, left: 0 },
              color: { top: '#000', right: '#000', bottom: '#000', left: '#000' }
            }
          }]
        }
      ],
      templateToLoad: null,
      // CKEDITOR
      editingText: false,
      draggedRowIndex: null
    }
  },
  computed: {
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

    handleDragStart(type, colorDraggedBtn = null) {
      this.dragItemType = type;
      this.colorDraggedBtn = colorDraggedBtn
    },

    addBlockToCanvas (rowIndex, columnIndex) {
      if (!this.dragItemType) return

      const blockId = `${this.dragItemType}-${Date.now()}`

      // Definir contenido JSON basado en el tipo de bloque
      let newBlock
      if (this.dragItemType === 'button') {
        newBlock = {
          blockId: blockId,
          type: 'button',
          properties: {
            text: 'Botón',
            href: '',
            backgroundColor: this.colorDraggedBtn,
            color: '#FFFFFF',
            padding: '12px 32px',
            borderRadius: '1px',
            aligment: 'center',
            containerPadding: {
              top: '10',
              right: '10',
              bottom: '10',
              left: '10',
            }
          }
        }
      } else if (this.dragItemType === 'text') {
        newBlock = {
          blockId: blockId,
          type: 'text',
          properties: {
            text: '<p style="text-align:center; margin:0">¡Texto MJML insertado!</p>',
            fontSize: '14px',
            color: '#000000',
            containerPadding: {
              top: '10',
              right: '10',
              bottom: '10',
              left: '10',
            }
          }
        }
      } else if (this.dragItemType === 'custom-column') {
        // Llamar a la función para generar la estructura compuesta con IDs únicos
        const newStructure = generateTextButtonStructure();
        newStructure.forEach(block => {
          this.rows[rowIndex].columns[columnIndex].content.push(block);
        }); 
      } else if (this.dragItemType === 'image') {
        // Crear un bloque de imagen con una URL predeterminada
        newBlock = {
          blockId: `image-${Date.now()}`,
          type: 'image',
          properties: {
            src: 'https://picsum.photos/id/237/536/354',
            alt: 'Imagen de ejemplo',
            href: '',
            width: 100,
            height: 'auto',
            aligment: 'center',
            containerPadding: {
              top: '10',
              right: '10',
              bottom: '10',
              left: '10',
            }
          }
        };
      }

      if (this.dragItemType === 'footer') {
        // Generar la estructura del footer
        const footerStructure = generateFooterStructure();
        
        // Agregar la estructura del footer a la columna seleccionada
        this.rows[rowIndex].columns[columnIndex] = footerStructure.columns[0];
      }

      if (this.dragItemType === 'threeSeven') {
        // Generar la estructura del footer
        const threeSevenStructure = generateThreeSevenStructure();
        
        // Agregar la estructura del footer a la columna seleccionada
        this.rows[rowIndex] = threeSevenStructure
      }

      if (this.dragItemType === 'sevenThree') {
        // Generar la estructura del footer
        const sevenThreeStructure = generateSevenThreeStructure();
        
        // Agregar la estructura del footer a la columna seleccionada
        this.rows[rowIndex] = sevenThreeStructure
      }

      if (this.dragItemType === 'sevenThreeWithMargins') {
        // Generar la estructura del footer
        const sevenThreeStructure = generateSevenThreeWithMarginStructure();
        
        // Agregar la estructura del footer a la columna seleccionada
        this.rows[rowIndex] = sevenThreeStructure
      }

      if (this.dragItemType === 'threeSevenWithMargins') {
        // Generar la estructura del footer
        const structure = generateThreeSevenWithMarginStructure();
        
        // Agregar la estructura del footer a la columna seleccionada
        this.rows[rowIndex] = structure
      }

      // Actualizamos el contenido de la columna con el bloque JSON
      if (newBlock) {
        this.rows[rowIndex].columns[columnIndex].content.push(newBlock)
        this.handleBlockSelection(blockId)
      }

      // Reseteamos el tipo de bloque arrastrado
      this.dragItemType = null

    },
    clearCanvas () {
      // Limpiamos todas las filas
      this.rows = [
        {
          isSelected: false,
          columns: [{
            content: [],
            backgroundColor: '#f0f0f0',
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            border: {
              width: { top: 0, right: 0, bottom: 0, left: 0 },
              color: { top: '#000', right: '#000', bottom: '#000', left: '#000' }
            }
          }]
        }
      ]
      this.selectedRowColumns = 0
      this.selectedRowIndex = null
      this.activeColumn = null
      this.selectedBlock = null
    },
    addRow () {
      this.rows.push({
        isSelected: false,
        columns: [{
          content: [],
          backgroundColor: '#f0f0f0',
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          border: {
            width: { top: 0, right: 0, bottom: 0, left: 0 },
            color: { top: '#000', right: '#000', bottom: '#000', left: '#000' }
          }
        }]
      })
    },
    handleDeleteRow (rowIndex) {
      console.log(`Eliminar fila ${rowIndex}`)
      if (this.rows.length == 1) {
        return
      }
      this.rows.splice(rowIndex, 1)

      // Reiniciar la selección de fila después de eliminarla
      this.selectedRowIndex = null
      this.selectedRowColumns = 0
      this.activeColumn = null
    },
    handleDuplicateRow(rowIndex) {
      console.log(`Duplicar fila ${rowIndex}`);

      // Clonar la fila original
      const originalRow = this.rows[rowIndex];
      const clonedRow = JSON.parse(JSON.stringify(originalRow));

      // Recorrer cada columna y actualizar los `blockId` en el contenido
      clonedRow.columns = clonedRow.columns.map(column => {
        return {
          ...column,
          content: column.content.map(block => {
            // Generar un nuevo blockId para cada bloque
            const oldBlockId = block.blockId;
            const prefix = oldBlockId.split('-')[0]; // Obtener el prefijo (button, text, image, etc.)
            const newBlockId = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`; // Generar un nuevo ID único

            // Actualizar el blockId y devolver el bloque actualizado
            return {
              ...block,
              blockId: newBlockId
            };
          })
        };
      });

      // Insertar la fila clonada justo después de la fila original
      this.rows.splice(rowIndex + 1, 0, clonedRow);

      console.log(`Fila ${rowIndex} duplicada en la posición ${rowIndex + 1}.`);
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
      this.selectedBlock = null
      this.selectedBlockId = null

      // Actualizamos el índice de la fila seleccionada
      this.selectedRowIndex = index
      this.selectedRowColumns = this.rows[index].columns.length
      this.selectColumn(0)
      console.log(`Fila ${index + 1} seleccionada con ${this.selectedRowColumns} columna(s)`)
    },
    selectColumn (index) {
      this.activeColumn = index
      this.columnBackgroundColor = this.rows[this.selectedRowIndex].columns[this.activeColumn].backgroundColor
      console.log(`Columna ${index + 1} seleccionada`)
    },
    handleBlockSelection (blockId) {
      // Iterar sobre filas y columnas para encontrar el bloque con el blockId
      for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
        const row = this.rows[rowIndex]
        for (let columnIndex = 0; columnIndex < row.columns.length; columnIndex++) {
          const column = row.columns[columnIndex]
          const block = column.content.find(block => block.blockId === blockId)

          if (block) {
            // Bloque encontrado, guardar referencias
            const isText = blockId.includes('text')
            const isButton = blockId.includes('button')
            this.selectedRowIndex = rowIndex
            this.selectedColumnIndex = columnIndex
            this.selectedBlockId = blockId
            this.selectedBlock = block // Guarda el bloque para futuras modificaciones
            // Deseleccionamos todas las filas primero
            this.rows.forEach((row, i) => {
              row.isSelected = false
            })

            this.activeColumn = null

            if (isButton) {
              this.buttonText = this.selectedBlock.properties.text // Asigna el texto del botón
              this.buttonLink = this.selectedBlock.properties.href // Asigna el href del botón
            }

            if (isText) {
              // Inicia CKEditor para bloques de texto
              this.editText(rowIndex, columnIndex)
              this.$nextTick(() => {
                const textContainer = document.querySelector(`.${blockId}`);
                if (textContainer) {
                  this.selectedTextContent = textContainer.innerHTML;
                  this.editingText = true;
                }
              });
            }

            console.log(`Bloque con ID ${blockId} seleccionado en fila ${rowIndex}, columna ${columnIndex}`)
            return
          }
        }
      }
    },

    /** Review
     *
     * Actualmente no se usa, revisar
     */

    // Need to know the row and column of the block selected without selecting the row
    getRowAndColumnOfBlock (blockId) {
      for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
        const columnIndex = this.rows[rowIndex].columns.findIndex(column => column.content.includes(blockId))
        if (columnIndex !== -1) {
          return { rowIndex, columnIndex }
        }
      }
      return { rowIndex: null, columnIndex: null }
    },

  handleDeleteBlock(blockId) {
    const column = this.getColumnFromBlockId(blockId); // Función para encontrar la columna
    if (column) {
      column.content = column.content.filter(block => block.blockId !== blockId);
    }
  },
  handleDuplicateBlock(blockId) {
    const column = this.getColumnFromBlockId(blockId); // Función para encontrar la columna
    if (column) {
      const blockToDuplicate = column.content.find(block => block.blockId === blockId);
      if (blockToDuplicate) {
        const newBlock = JSON.parse(JSON.stringify(blockToDuplicate));
      
        // Genera un nuevo ID único para el bloque duplicado
        newBlock.blockId = `${newBlock.type}-${Date.now()}`;
        const index = column.content.findIndex(block => block.blockId === blockId);
        column.content.splice(index + 1, 0, newBlock);
      }
    }
  },
  getColumnFromBlockId(blockId) {
    for (const row of this.rows) {
      for (const column of row.columns) {
        if (column.content.some(block => block.blockId === blockId)) {
          return column;
        }
      }
    }
    return null;
  },

    updateContainerPadding ({ side, value }) {
      if (this.selectedBlock) {
        this.selectedBlock.properties.containerPadding[side] = value
      }
    },

    updateButtonText (newText) {
      if (this.selectedBlock) {
        this.selectedBlock.properties.text = newText
        console.log(`Text del bloque con ID ${this.selectedBlockId} actualizado a: ${newText}`)
      } else {
        console.log('No hay bloque seleccionado.')
      }
    },
    updateButtonHref (newHref) {
      if (this.selectedBlock && this.selectedBlock.type === 'button') {
        this.selectedBlock.properties.href = newHref
        console.log(`Href del bloque con ID ${this.selectedBlockId} actualizado a: ${newHref}`)
      } else {
        console.log('No hay bloque seleccionado o el bloque seleccionado no es un botón.')
      }
    },
    // Review: cambiado por updateBlockAligment
    updateButtonAlignment (alignment) {
      if (this.selectedBlock) {
        const blockId = this.selectedBlock.blockId
        this.selectedBlock.properties.alignment = alignment
        const blockElement = document.querySelector(`[data-block-id="${this.selectedBlock.blockId}"]`)

        if (blockElement) {
          blockElement.style.textAlign = `${alignment}`
          console.log(`Alineación del botón actualizada a: ${alignment}`)
        }

        // // Actualizar el contenido en `rows` para el elemento específico
        // const tempContainer = document.createElement('div');
        // tempContainer.innerHTML = this.rows[rowIndex].columns[columnIndex].content;

        // const targetElement = tempContainer.querySelector(`.${blockId}`);
        // if (targetElement) {
        //   targetElement.style.textAlign = `-webkit-${alignment}`;
        //   // Actualizar el contenido de la columna con el cambio aplicado
        //   this.rows[rowIndex].columns[columnIndex].content = tempContainer.innerHTML;
        // }
      }
    },
    updateImageHref (newHref) {
      if (this.selectedBlock && this.selectedBlock.type === 'image') {
        this.selectedBlock.properties.href = newHref
        console.log(`Href del bloque con ID ${this.selectedBlockId} actualizado a: ${newHref}`)
      } else {
        console.log('No hay bloque seleccionado o el bloque seleccionado no es un img.')
      }
    },
    updateImageWidth (newWidth) {
      if (this.selectedBlock && this.selectedBlock.type === 'image') {
        this.selectedBlock.properties.width = newWidth
        console.log(`width del bloque con ID ${this.selectedBlockId} actualizado a: ${newWidth}`)
      } else {
        console.log('No hay bloque seleccionado o el bloque seleccionado no es un img.')
      }
    },
    updateBlockAligment (aligment) {
      this.selectedBlock.properties.aligment = aligment
    },
    editText (rowIndex, columnIndex) {
      this.editingText = true
    },
    updateTextBlockContent (newContent) {
      console.log('newContent:', newContent)

      // Ajusta el contenido de <p> para que todos tengan margin: 0
      const adjustedContent = newContent.replace(/<p(\s+[^>]*)?>/g, (match, attrs) => {
          if (attrs && attrs.includes('style=')) {
              // Si ya existe un estilo, añade margin: 0 dentro del style actual
              return match.replace(/style="([^"]*)"/, 'style="$1; margin: 0;"');
          } else {
              // Si no tiene estilo, añade uno con margin: 0
              return `<p style="margin: 0;"${attrs || ''}>`;
          }
      });

      console.log('Contenido después de aplicar margen:', adjustedContent);

      // Encuentra el bloque seleccionado en el JSON de datos
      const selectedRow = this.rows[this.selectedRowIndex]
      const selectedColumn = selectedRow.columns[this.selectedColumnIndex]
      const block = selectedColumn.content.find(block => block.blockId === this.selectedBlock.blockId)

      if (block && block.type === 'text') {
        // Actualiza el contenido HTML completo en `text`
        block.properties.text = adjustedContent
        console.log(`Contenido HTML del bloque ${block.blockId} actualizado: ${adjustedContent}`)
      } else {
        console.log('No se encontró el bloque de texto para actualizar.')
      }
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

    /* Review
      Actualmente no se usa, revisar

    */
    getColumnIndexFromBlockId (blockId) {
      const rowIndex = this.getRowIndexFromBlockId(blockId)
      if (rowIndex !== null) {
        return this.rows[rowIndex].columns.findIndex(column => column.content.includes(blockId))
      }
      return null
    },

    // Updates column properties methods
    updateColumnBackgroundColor (newColor) {
      if (this.selectedRowIndex !== null && this.activeColumn !== null) {
        this.columnBackgroundColor = newColor
        this.rows[this.selectedRowIndex].columns[this.activeColumn].backgroundColor = newColor
      }
    },

    updateColumnPadding ({ side, value }) {
      if (this.selectedRowIndex !== null && this.activeColumn !== null) {
        this.rows[this.selectedRowIndex].columns[this.activeColumn].padding[side] = value
      }
    },
    updateColumnBorderWidth ({ side, value }) {
      this.rows[this.selectedRowIndex].columns[this.activeColumn].border.width[side] = value
    },
    updateColumnBorderColor ({ side, value }) {
      this.rows[this.selectedRowIndex].columns[this.activeColumn].border.color[side] = value
    },
    upBlock (index) {
      const content = this.rows[this.selectedRowIndex]?.columns[this.selectedColumnIndex].content
      const temp = content[index];
      content.splice(index, 1);
      content.splice(index - 1, 0, temp);
    },
    downBlock (index) {
      const content = this.rows[this.selectedRowIndex]?.columns[this.selectedColumnIndex].content
      const temp = content[index];
      content.splice(index, 1);
      content.splice(index + 1, 0, temp);
    },

    /// /// Drag and drops on rows /////
    handleDragStartRow (dragEvent, index) {
      this.draggedRowIndex = index

      // Clonar el elemento de la fila y usarlo como imagen de arrastre
      const rowElement = dragEvent.target.closest('.row')
      const rowClone = rowElement.cloneNode(true)
      rowClone.style.position = 'absolute'
      rowClone.style.top = '-9999px'
      rowClone.style.left = '-9999px'
      document.body.appendChild(rowClone)

      // Ajustar la posición del punto de arrastre dentro del clon
      const offsetX = 250 // Ajusta este valor para mover el clon hacia la izquierda
      const offsetY = rowClone.offsetHeight / 2 // Centrado verticalmente

      // Usar el clon como imagen de arrastre con desplazamiento
      dragEvent.dataTransfer.setDragImage(rowClone, offsetX, offsetY)

      // Remover el clon después de un pequeño retraso para asegurarse de que se usa
      setTimeout(() => {
        document.body.removeChild(rowClone)
      }, 0)
    },
    handleDragOverRow (index) {
      // Solo prevenir el comportamiento por defecto
    },
    handleDropRow (index) {
      // Movemos la fila a la nueva posición
      if (this.draggedRowIndex !== null && this.draggedRowIndex !== index) {
        const draggedRow = this.rows.splice(this.draggedRowIndex, 1)[0]
        this.rows.splice(index, 0, draggedRow)
      }
      // Resetear el índice arrastrado
      this.draggedRowIndex = null
    },
    // Método para obtener la clase CSS correcta según el número de columnas y proporciones
    getColumnClass (numColumns, firstColumnWidth) {
      if (numColumns === 1) {
        return 'single-column'
      } else if (numColumns === 2) {
        if (firstColumnWidth && firstColumnWidth === 67) {
          return 'two-columns two-columns-67-33'
        } else if (firstColumnWidth && firstColumnWidth === 33) {
          return 'two-columns two-columns-33-67'
        } else {
          return 'two-columns'
        }
      } else if (numColumns === 3) {
        return 'three-columns'
      } else if (numColumns === 4) {
        return 'four-columns'
      }
      return '' // Clase vacía si no se cumple ninguna condición
    },
    // Método para configurar el número de columnas y sus proporciones
    configureColumns(numColumns, proportions = []) {
      // Review: Una vez el panel solo salga al seleccionar una fila, se puede eliminar
      if (this.selectedRowIndex === null) {
        console.log('Por favor, selecciona una fila primero.');
        return;
      }

      const currentColumns = this.rows[this.selectedRowIndex].columns;
      const newColumns = Array.from({ length: numColumns }, (_, i) => {
        // Mantener el contenido y configuraciones si la columna actual existe
        return currentColumns[i]
          ? {
              ...currentColumns[i], // Mantener la configuración y contenido actuales
              width: proportions[i] || (100 / numColumns) + '%' // Ajustar el ancho según proporciones
            }
          : {
              content: [], // Nueva columna sin contenido
              backgroundColor: '#f0f0f0',
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              border: {
                width: { top: 0, right: 0, bottom: 0, left: 0 },
                color: { top: '#000', right: '#000', bottom: '#000', left: '#000' }
              },
              width: proportions[i] || (100 / numColumns) + '%'
            };
      });

      // Asignar la nueva configuración de columnas a la fila seleccionada
      this.rows[this.selectedRowIndex].columns = newColumns;

      // Actualizar las variables de estado
      this.selectedRowColumns = numColumns;
      this.activeColumn = 0;

      console.log(`Fila ${this.selectedRowIndex + 1} configurada con ${numColumns} columnas.`);
    },

    /// test generate mjml
    generateMJML () {
      let mjmlContent = `
            <mjml>
                <mj-body>
        `

      this.rows.forEach(row => {
        mjmlContent += '<mj-section>'

        row.columns.forEach(column => {
          mjmlContent += `
                    <mj-column
                        background-color="${column.backgroundColor || '#ffffff'}"
                        padding="${column.padding.top}px ${column.padding.right}px ${column.padding.bottom}px ${column.padding.left}px"
                        border-top="${column.border.width.top}px solid ${column.border.color.top}"
                        border-right="${column.border.width.right}px solid ${column.border.color.right}"
                        border-bottom="${column.border.width.bottom}px solid ${column.border.color.bottom}"
                        border-left="${column.border.width.left}px solid ${column.border.color.left}"
                    >
                `

          if (column.content) {
            const container = document.createElement('div')
            container.innerHTML = column.content

            container.querySelectorAll('.block-wrapper').forEach(block => {
              const blockId = block.getAttribute('data-block-id')

              if (blockId.startsWith('button')) {
                const buttonElement = block.querySelector('a')
                const buttonMjml = `
                                <mj-button
                                    href="${buttonElement.getAttribute('href') || '#'}"
                                    background-color="${buttonElement.style.backgroundColor || '#1973b8'}"
                                    color="${buttonElement.style.color || '#ffffff'}"
                                >
                                    ${buttonElement.innerHTML}
                                </mj-button>
                            `
                mjmlContent += buttonMjml
              } else if (blockId.startsWith('text')) {
                const textElement = block.querySelector('p, div')
                const textMjml = `
                                <mj-text>
                                    ${textElement.innerHTML}
                                </mj-text>
                            `
                mjmlContent += textMjml
              }
            })
          }

          mjmlContent += '</mj-column>'
        })

        mjmlContent += '</mj-section>'
      })

      mjmlContent += `
                </mj-body>
            </mjml>
        `

      return mjmlContent
    },

    exportMJMLToHTML () {
      const mjmlContent = this.generateMJML()
      const { html } = mjml2html(mjmlContent)
      this.saveTemplate()
      console.log(html) // Aquí puedes manejar el HTML como desees
    },
    saveTemplate () {
      const templateData = JSON.stringify(this.rows)
      this.templateToLoad = templateData
      console.log(templateData)
    },
    loadTemplate () {
      this.rows = JSON.parse(this.templateToLoad)
    },

    generateButtonHtml (block) {
      const alignmentStyle = block.properties.alignment ? `text-align: ${block.properties.alignment};` : ''

      return `
        <div style="${alignmentStyle}">
          <a href="${block.properties.href}" style="display: inline-block; background-color: ${block.properties.backgroundColor}; color: ${block.properties.color}; padding: ${block.properties.padding}; border-radius: ${block.properties.borderRadius}; text-decoration: none;">
            ${block.properties.text}
          </a>
        </div>
      `
    }
  }
}
</script>

<style scoped>

.wrapper {
  display: grid;
  grid-template-columns: 4fr 2fr;
}
/* Estilos para el lienzo */
.canvas {
  border: 1px solid #ddd;
  padding: 20px;
  min-height: 70vh;
  min-width: 70%;
}

.canvas > a {
  color: white;
}

.row {
  position: relative; /* Para posicionar el indicador de arrastre */
  padding: 0 20px;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
}

/* .row:hover:not(.row-selected) {
  outline: 1px dashed #1e90ff;
  background-color: #e6f2fb;
} */

.row.hoverable:hover:not(.row-selected) {
  outline: 1px dashed #1e90ff; /* Borde punteado */
  background-color: #e6f2fb;  /* Azul claro */
}

.row-selected {
  outline: 1px solid #1e90ff; /* Borde sólido azul oscuro */
  background-color: #dbeafe;  /* Azul más oscuro */
  z-index: 1;
}

/* Deshabilitar el hover de las filas dentro de columnas con contenido */
.column.with-content:hover ~ .row.hoverable {
  outline: none;
  background-color: transparent;
}

/* Indicador de arrastre */
.drag-handle {
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translateY(-50%);
  background-color: #6cb5f9;
  color: #fff;
  width: 30px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-top-left-radius: 50%;
  border-bottom-left-radius: 50%;
  cursor:grab;
  box-shadow: 0px 1px 4px rgba(0, 0, 0, 0.2);
}

.drag-icon {
  font-size: 20px;
}

/* Estilo para el recuadro de acciones */
.row-action-panel {
  z-index: 4;
  position: absolute;
  top: 100%;
  right: 0px; /* Ajusta la posición del recuadro según sea necesario */
  display: flex;
  gap: 8px;
  padding: 4px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
}

/* Estilo para los iconos dentro del recuadro */
.row-action-icon {
  font-size: 18px;
  cursor: pointer;
  color: #333;
}

.row-action-icon:hover {
  color: #007bff; /* Color al pasar el cursor */
}

.row p {
  color: #1e90ff;
  margin: 0;
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
}

.column > div {
  width: 100%;
  max-width: 600px;
  z-index: 1;
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
  /* display: flex;
  flex-wrap: wrap; */
  justify-content: space-between;
  gap: 16px;
  padding: 12px;
  padding-bottom: 0;
  align-items: flex-start;
}

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

.properties-panel {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.color-picker {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 16px;
}

.color-picker label {
  font-weight: bold;
  color: #333;
}

.color-picker input[type="color"] {
  appearance: none !important;
  outline: none;
  border: none;
  width: 32px;
  height: 32px;
  cursor: pointer;
}

.color-preview {
  width: 32px;
  height: 32px;
  border-radius: 4px;
  border: 1px solid #ddd;
  cursor: pointer;
}

.tool-panel {
  margin-top: 16px;
  width: 100%;
}

/* Estilos generales para la fila */
.row {
  display: flex;
  gap: 10px;
}

.z-index-row {
  z-index: 20;
}

.columns-container {
  width: 600px;
  margin: 0 auto; /* Centra el contenedor en la fila */
  display: flex;
  gap: 0; /* Sin espacio entre columnas */
}

.column-outlined {
  outline: 1px blue dashed;
  outline-offset: -1px;
  z-index: 1;
}

.column-min-height {
  min-height: 100px;
}

/* Configuración para una sola columna */
.single-column {
  display: flex;
  justify-content: center;
}

.single-column .column {
  width: 100%;
}

/* Configuración para dos columnas iguales */
.two-columns {
  display: flex;
  gap: 10px;
}

.two-columns .column {
  width: 50%;
}

/* Configuración para dos columnas con proporciones 67/33 */
.two-columns-67-33 .column:nth-child(1) {
  width: 67%;
}

.two-columns-67-33 .column:nth-child(2) {
  width: 33%;
}

/* Configuración para dos columnas con proporciones 33/67 */
.two-columns-33-67 .column:nth-child(1) {
  width: 33%;
}

.two-columns-33-67 .column:nth-child(2) {
  width: 67%;
}

/* Configuración para tres columnas */
.three-columns {
  display: flex;
  gap: 10px;
}

.three-columns .column {
  width: 33.33%;
}

/* Configuración para cuatro columnas */
.four-columns {
  display: flex;
  gap: 10px;
}

.four-columns .column {
  width: 25%;
}

.actions-buttons {
  display: flex;
  gap: 8px;
  margin-bottom: 10px;
}

.action-button {
  border-radius: 8px;
  border: 1px solid transparent;
  padding: 0.6em 1.2em;
  font-size: 1em;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
}
.action-button:hover {
  border-color: #646cff;
}
.action-button:focus,
.action-button:focus-visible {
  outline: 4px auto -webkit-focus-ring-color;
}

</style>
