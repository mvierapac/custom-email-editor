<template>
  <div>
    <!-- <ActionsButtonPanel
      :disableSave="disableSave"
      @exit="exit"
      @save="saveAndEmitContent"
      @saveAndExit="saveAndEmitContent(true)"
    /> -->


    <div class="wrapper">
      <div>
        <HeaderPanel 
          @clear-canvas="openModalConfirm('clearCanvas')"
          @undo="undo"
          @redo="redo"
          @show-preview="showPreview"
        />
        <div class="editor-layout">
          <div class="canvas" ref="editorContainer">
          <div
            v-for="(row, rowIndex) in rows"
            :key="rowIndex"
            :class="[
              'row', 
              { 'row-selected': row.isSelected },
              {'z-index-row': this.selectedRowIndex === rowIndex || this.selectedBlockRowIndex === rowIndex},
              getColumnClass(row.columns.length,row.columns[0].width)
            ]"
            @click="selectRow(rowIndex, $event)"
          >

            <AddRowButton v-if="rowIndex === rows.length -1" @add-row="addRow"/>

            <!-- Panel de acciones de la fila -->
            <div
              v-if="row.isSelected"
              class="row-action-panel"
            >
            <v-tooltip v-if="rowIndex !== 0" content-class="tooltip" location="bottom">
              <template v-slot:activator="{ props }">
                <button 
                  v-bind="props"
                  class="block-action-icon mdi mdi-chevron-up"
                  :style="{fontSize: '26px'}"
                  @click.stop="upRow(rowIndex)"
                >
                </button>
              </template>
              <span>{{ $t('EDITOR.UP_ROW') }}</span>
            </v-tooltip>

            <v-tooltip v-if="rowIndex !== rows.length-1" content-class="tooltip" location="bottom">
              <template v-slot:activator="{ props }">
                <button 
                  v-bind="props"
                  class="block-action-icon mdi mdi-chevron-down"
                  :style="{fontSize: '26px'}"
                  @click.stop="downRow(rowIndex)"
                >
                </button>
              </template>
              <span>{{ $t('EDITOR.DOWN_ROW') }}</span>
            </v-tooltip>
            
            <v-tooltip content-class="tooltip" location="bottom">
              <template v-slot:activator="{ props }">
                <button class="row-action-icon mdi mdi-delete" v-bind="props" @click="handleDeleteRow(rowIndex)"></button>
              </template>
              <span>{{ $t('COMMON.DELETE') }}</span>
            </v-tooltip>

            <v-tooltip content-class="tooltip" location="bottom">
              <template v-slot:activator="{ props }">
                <button class="row-action-icon mdi mdi-content-copy" v-bind="props" @click="handleDuplicateRow(rowIndex)"></button>
              </template>
              <span>{{ $t('COMMON.DUPLICATE') }}</span>
            </v-tooltip> 

            </div>
            <!-- Renderización dinámica de columnas -->
            <div 
              class="columns-container"
              :style="{
                  backgroundColor: row.bgColor,
                  paddingTop: row.padding.top + 'px',
                  paddingRight: row.padding.right + 'px',
                  paddingBottom: row.padding.bottom + 'px',
                  paddingLeft: row.padding.left + 'px',
                }"              
              >
              <div
                v-for="(column, columnIndex) in row.columns"
                :key="columnIndex"
                class="column"
                :style="{
                  backgroundColor: column.backgroundColor || '#ffffff',
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
                    @edit-text="openModalEditText(block)"
                    @upload-image="openPickerImage()"
                  />
                </div>
              <p v-else :style="{'align-self': 'center'}">{{ $t('EDITOR.EMPTY_COLUMN_TEXT') }}</p>
              </div>
            </div>
          </div>
        </div>          
        </div>
      </div>
      <div>
        <div class="lateral-panel">
          <configure-columns-panel
            v-if="selectedRowIndex !== null"
            @configure-columns="configureColumns"
          />
          <Predefined-rows-panel
            v-if="selectedRowIndex !== null"
            @drag-start="handleDragStart"
          />
          <Tools-panel ref="toolsPanel" @drag-start="handleDragStart" />

          <!-- Herramientas y propiedades de columna -->
          <RowPropertiesPanel
            v-if="activeColumn !== null"
            :rowBackgroundColor="rows[selectedRowIndex]?.bgColor"
            :rowPadding="rows[selectedRowIndex]?.padding"
            @update-background-color="updateRowBackgroundColor"
            @update-padding="updateRowPadding"
          />

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
            :alignment="selectedBlock.properties.alignment"
            @update-button-href="updateButtonHref"
            @update-button-text="updateButtonText"
            @update-button-alignment="updateBlockAligment"
            @update-container-padding="updateContainerPadding"
          />
          <TextPropertiesPanel
            v-if="selectedBlock && (selectedBlock.type === 'text' || selectedBlock.type === 'texticon')"
            :containerPadding="selectedBlock.properties.containerPadding"
            :lineHeight="selectedBlock.properties.lineHeight"
            @update-container-padding="updateContainerPadding"
            @update-line-height="updateTextLineHeight"
          />
          <ImagePropertiesPanel
            v-if="selectedBlock && selectedBlock.type === 'image' && selectedBlock.editable !== false"
            ref="imagePropertiesPanel"
            :imageLink="selectedBlock.properties.href"
            :imageWidth="selectedBlock.properties.width"
            :containerPadding="selectedBlock.properties.containerPadding"
            :alignment="selectedBlock.properties.alignment"
            @update-container-padding="updateContainerPadding"
            @update-block-alignment="updateBlockAligment"
            @update-img-href="updateImageHref"
            @update-img-width="updateImageWidth"
            @update-img-src="updateImageSrc"
          />

        </div>
      </div> 
  </div>

    <!-- Modal confirm -->
    <modal
      :shownModal="modalConfirm.shown"
      v-if="modalConfirm.shown"
      :title="$t('EDITOR.CONFIRM_CLEAR_CANVAS')"
      :iconType="1"
      :textButton="$t('COMMON.CONFIRM')"
      :textLink="$t('COMMON.CANCEL')"
      @eventButtonModal="handleModalConfirmAction"
      @eventLinkModal="modalConfirm.close"
    >
    </modal>

    <EditTextDialog 
      v-if="modalEditText.shown" 
      class="modal-ckeditor"
      @confirm="updateTextBlockContent"
      @close="modalEditText.close"
    >

      <InlineEditor
        :initialContent="modalEditText.originalText"
        @updateContent="updateNewText"
      />
    </EditTextDialog>

    <PreviewContent
      :showPreview="showPreviewContent"
      :template="htmlForPreview"
      @close="closePreview"
    ></PreviewContent>

  </div>
</template>

<script>
import mjml2html from 'mjml-browser'
import InlineEditor from './InlineEditor.vue'

import ConfigureColumnsPanel from './lateralPanelComponents/ConfigureColumnsPanel.vue'
import ColumnPropertiesPanel from './lateralPanelComponents/ColumnPropertiesPanel.vue'
import RowPropertiesPanel from './lateralPanelComponents/RowPropertiesPanel.vue'
import ColumnTabs from './lateralPanelComponents/ColumnTabs.vue'
import ToolsPanel from './lateralPanelComponents/ToolsPanel.vue'
import PredefinedRowsPanel from './lateralPanelComponents/PredefinedRowsPanel.vue'
import ButtonPropertiesPanel from './lateralPanelComponents/ButtonPropertiesPanel.vue'
import TextPropertiesPanel from './lateralPanelComponents/TextPropertiesPanel.vue'
import ImagePropertiesPanel from './lateralPanelComponents/ImagePropertiesPanel.vue'

import AddRowButton from './auxiliarComponents/AddRowButton.vue'
import HeaderPanel from './auxiliarComponents/HeaderPanel.vue'
import ActionsButtonPanel from '_editor/auxiliarComponents/ActionsButtonsPanel.vue'

import BlockRenderer from './BlockRenderer.vue'
import EditTextDialog from './auxiliarComponents/EditTextDialog.vue'
import PreviewContent from './auxiliarComponents/PreviewContent.vue'
import Modal from './Modal.vue'

import { generateButtonBlock, generateImgBlock, generateTextBlock } from '_editor/generateBlocksFunctions'
import { generateTwoColumnstructure, generateThreeColumnstructure, generateThreeSevenStructure, generateSevenThreeStructure } from '_editor/generateCustomRowsFunctions.js'

export default {

  mounted () {
    // Intercepta todos los clics en enlaces dentro del editor
    this.$refs.editorContainer.addEventListener('click', this.preventLinkNavigation)
    this.saveHistory()
    this.selectRow(0)
  },

  beforeUnmount () {
    this.$refs.editorContainer.removeEventListener('click', this.preventLinkNavigation)
  },

  components: {
    InlineEditor,
    BlockRenderer,
    ColumnPropertiesPanel,
    RowPropertiesPanel,
    ConfigureColumnsPanel,
    ColumnTabs,
    ToolsPanel,
    PredefinedRowsPanel,
    ButtonPropertiesPanel,
    TextPropertiesPanel,
    ImagePropertiesPanel,
    AddRowButton,
    HeaderPanel,
    ActionsButtonPanel,
    Modal,
    EditTextDialog,
    PreviewContent,
  },
  props: {
    disableSave: {
      type: Boolean,
      default: false
    }
  },

  data () {
    return {
      showCkeditor: false,
      selectedColumnIndex: null,
      selectedBlockId: null,
      selectedRowIndex: null, // Almacena el índice de la fila seleccionada
      selectedRowColumns: 0,
      selectedBlockRowIndex: null,
      activeColumn: null, // Columna actualmente seleccionada en el panel
      dragItemType: null,
      colorDraggedBtn: null,
      selectedBlock: null,
      columnBackgroundColor: '#FFFFFF',
      buttonText: '',
      buttonLink: '',
      rows: [
        {
          isSelected: false,
          bgColor: '#ffffff',
          padding: { top: 10, right: 40, bottom: 10, left: 40 },
          columns: [{
            content: [],
            width: "100%",
            backgroundColor: '#ffffff',
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            border: {
              width: { top: 0, right: 0, bottom: 0, left: 0 },
              color: { top: '#000000', right: '#000000', bottom: '#000000', left: '#000000' }
            }
          }]
        }
      ],
      history: {
        past: [],
        present: null,
        future: []
      },
      minWidth: {
        50: '260px' ,
        33: '171px' ,
        67:  '348px',
        100: '520px'
      },
      editingText: false,
      showPreviewContent: false,
      htmlForPreview: '',
      modalConfirm: {
        shown: false,
        action: null,
        close: () => {
          this.modalConfirm.action = null
          this.modalConfirm.shown = false
        }
      },
      // CKEDITOR
      modalEditText: {
        shown: false,
        originalText: null,
        close: () => {
          this.modalEditText.originalText = null
          this.modalEditText.shown = false
        }
      },
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

    openModalConfirm (action) {
      this.modalConfirm.action = action
      this.modalConfirm.shown = true
    },

    handleModalConfirmAction () {
      this[this.modalConfirm.action]()
      this.modalConfirm.close()
    },

    handleDragStart(type, colorDraggedBtn = null) {
      this.dragItemType = type;
      this.colorDraggedBtn = colorDraggedBtn
    },

    hasContentInRow(index) {
      return this.rows[index].columns.some(column => column.content.length > 0);
    },

    addRowWithContent (content) {
      this.addRow()
      this.rows[this.rows.length-1] = content
      this.selectRow(this.rows.length-1)
    },

    addBlockToCanvas (rowIndex, columnIndex) {
      if (!this.dragItemType) return

      const blockId = `${this.dragItemType}-${Date.now()}`

      let newBlock
      if (this.dragItemType === 'button') {
        newBlock = generateButtonBlock(this.colorDraggedBtn)
      } else if (this.dragItemType === 'text') {
        newBlock = generateTextBlock()
      } else if (this.dragItemType === 'image') {
        newBlock = generateImgBlock()
      }

      if (this.dragItemType === 'threeSeven') {
        const structure = generateThreeSevenStructure();
        this.handleAddStructureToCanvas(structure, rowIndex)
      }

      if (this.dragItemType === 'sevenThree') {
        const structure = generateSevenThreeStructure();
        this.handleAddStructureToCanvas(structure, rowIndex)
      }

      if (this.dragItemType === 'two-column') {
        const structure = generateTwoColumnstructure();
        this.handleAddStructureToCanvas(structure, rowIndex)
      }

      if (this.dragItemType === 'three-column') {
        const structure = generateThreeColumnstructure();
        this.handleAddStructureToCanvas(structure, rowIndex)
      }
      // Actualizamos el contenido de la columna con el bloque JSON
      if (newBlock) {
        this.rows[rowIndex].columns[columnIndex].content.push(newBlock)
        this.handleBlockSelection(blockId)
      }
      // Reseteamos el tipo de bloque arrastrado
      this.dragItemType = null
      this.saveHistory('createBlock')
    },
    handleAddStructureToCanvas (structure, rowIndex) {
      if (this.hasContentInRow(rowIndex)) {
          this.addRowWithContent(structure)
        } else {
          this.rows[rowIndex] = structure
          this.selectRow(rowIndex)
        }      
    },
    clearCanvas () {
      // Limpiamos todas las filas
      this.rows = [
        {
          isSelected: false,
          bgColor: '#ffffff',
          padding: { top: 10, right: 40, bottom: 10, left: 40 },
          columns: [{
            content: [],
            backgroundColor: '#ffffff',
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
      this.selectRow(0)
    },
    addRow () {
      this.rows.push({
        isSelected: false,
        bgColor: '#ffffff',
        padding: { top: 10, right: 40, bottom: 10, left: 40 },
        columns: [{
          width: 100,
          content: [],
          backgroundColor: '#ffffff',
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          border: {
            width: { top: 0, right: 0, bottom: 0, left: 0 },
            color: { top: '#000', right: '#000', bottom: '#000', left: '#000' }
          }
        }]
      })
      this.selectRow(this.rows.length-1)
      this.saveHistory()
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
      this.saveHistory()
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
      this.saveHistory()
    },
    selectRow (index, event) {
      const clickedElement = event?.target.closest('.block-wrapper') // Detecta si el clic fue en un bloque

      if (clickedElement) {
        // Si el clic fue en un bloque, no seleccionamos la fila
        return
      }
      // Deseleccionamos todas las filas primero
      this.rows.forEach((row, i) => {
        row.isSelected = i === index
      })

      this.selectedBlockRowIndex = null

      // Deseleccionar bloque
      this.selectedBlock = null
      this.selectedBlockId = null

      // Actualizamos el índice de la fila seleccionada
      this.selectedRowIndex = index
      this.selectedRowColumns = this.rows[index].columns.length
      this.selectColumn(0)
      console.log(`Fila ${index + 1} seleccionada con ${this.selectedRowColumns} columna(s)`)
    },
    upRow (index) {
      if (index > 0) {
        const temp = this.rows[index - 1];
        this.rows[index - 1] = this.rows[index];
        this.rows[index] = temp;
        this.selectRow(index-1)
      }
    },
    downRow (index) {
      if (index < this.rows.length - 1) {
        const temp = this.rows[index + 1];
        this.rows[index + 1] = this.rows[index];
        this.rows[index] = temp;
        this.selectRow(index+1)
      }
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
            this.selectedRowIndex = null
            this.selectedBlockRowIndex = rowIndex
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
            console.log(`Bloque con ID ${blockId} seleccionado en fila ${rowIndex}, columna ${columnIndex}`)
            return
          }
        }
      }
    },

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
    this.saveHistory('deleteBlock')
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
    this.saveHistory('duplicateBlock')
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
      this.saveHistory('updateContainerPadding')
    },

    updateButtonText (newText) {
      if (this.selectedBlock) {
        this.selectedBlock.properties.text = newText
      }
      this.saveHistory()
    },
    updateButtonHref (newHref) {
      if (this.selectedBlock && this.selectedBlock.type === 'button') {
        this.selectedBlock.properties.href = newHref
        this.saveHistory()
      }
    },
    updateTextLineHeight (lh) {
      if (this.selectedBlock && this.selectedBlock.type === 'text') {
        this.selectedBlock.properties.lineHeight = lh
        this.saveHistory()
      }
    },
    updateImageHref (newHref) {
      if (this.selectedBlock && this.selectedBlock.type === 'image') {
        this.selectedBlock.properties.href = newHref
        this.saveHistory()
        console.log(`Href del bloque con ID ${this.selectedBlockId} actualizado a: ${newHref}`)
      } else {
        console.log('No hay bloque seleccionado o el bloque seleccionado no es un img.')
      }
    },
    updateImageWidth (newWidth) {
      if (this.selectedBlock && this.selectedBlock.type === 'image') {
        this.selectedBlock.properties.width = newWidth
        this.saveHistory()
        console.log(`width del bloque con ID ${this.selectedBlockId} actualizado a: ${newWidth}`)
      } else {
        console.log('No hay bloque seleccionado o el bloque seleccionado no es un img.')
      }
    },
    updateImageSrc (newSrc) {
      if (this.selectedBlock && this.selectedBlock.type === 'image') {
        console.log(this.selectedBlock.properties)
        this.selectedBlock.properties.src = newSrc
        this.saveHistory()
      }    
    },
    updateBlockAligment (alignment) {
      this.saveHistory()
      this.selectedBlock.properties.alignment = alignment
    },
    openModalEditText (block) {
      this.modalEditText.originalText = block.properties?.text
      this.modalEditText.shown = true
      this.editingText = true
    },
    updateNewText (newText) {
      this.modalEditText.newText = newText
    },
    updateTextBlockContent () {
      let newContent = this.modalEditText.newText
      console.log('newContent:', newContent)

      // Ajusta el contenido de <p> para que todos tengan margin: 0
      const adjustedContent = newContent.replace(/<p(\s+[^>]*)?>/g, (match, attrs) => {
        if (attrs && attrs.includes('style=')) {
            // Si ya existe un estilo, añade margin: 0 y verifica text-align
            return match.replace(/style="([^"]*)"/, (styleMatch, styleContent) => {
                const hasTextAlign = /text-align\s*:\s*[^;]+/.test(styleContent);
                const updatedStyle = `${styleContent}; margin: 0;${hasTextAlign ? '' : ' text-align: left;'}`;
                return `style="${updatedStyle.trim()}"`;
            });
        } else {
            // Si no tiene estilo, añade uno con margin: 0 y text-align: left
            return `<p style="margin: 0; text-align: left;"${attrs || ''}>`;
        }
      });

      console.log('Contenido después de aplicar margen:', adjustedContent);

      // Ajustar imágenes dentro de <figure>
        const adjustedWithFigureStyles = adjustedContent.replace(/<figure([^>]*)style="([^"]*)"[^>]*>\s*<img([^>]*)style="([^"]*)"/g, (match, figureAttrs, figureStyle, imgAttrs, imgStyle) => {
        let updatedStyle = imgStyle;

        // Extraer el width del figure
        const figureWidthMatch = figureStyle.match(/width\s*:\s*([^;]+);?/);
        const figureWidth = figureWidthMatch ? figureWidthMatch[1].trim() : null;

        // Asignar el width del figure al img
        if (figureWidth && !/width\s*:\s*[^;]+;/.test(imgStyle)) {
          updatedStyle += ` width: ${figureWidth};`;
        }

        // Asegurar height: auto;
        if (!/height\s*:\s*auto;/.test(updatedStyle)) {
          updatedStyle += ' height: auto;';
        }

        // Mantener el <figure> intacto
        return `<figure${figureAttrs} style="${figureStyle}"><img${imgAttrs}style="${updatedStyle}"`;
      });

      // Asegurar de que las imágenes tienen height: auto en su estilo
      const adjustedWithImageStyles = adjustedWithFigureStyles.replace(/<img([^>]*)style="([^"]*)"([^>]*)>/g, (match, attrsBeforeStyle, style, attrsAfterStyle) => {
      let updatedStyle = style;

      if (!/height\s*:\s*auto;/.test(style)) {
        updatedStyle = style.replace(/(width\s*:[^;]+;?)/, '$1 height:auto;');
      }

      const styleWidthMatch = style.match(/width\s*:\s*([\d.]+)px/);
      const styleWidthValue = styleWidthMatch ? styleWidthMatch[1] : null;

      const attrsWithoutHeight = attrsAfterStyle.replace(/\s*height="[^"]*"/, '');

      if (styleWidthValue) {
        if (/width="[^"]*"/.test(match)) {
          // Si ya existe width, reemplazarlo
          return `<img${attrsBeforeStyle}style="${updatedStyle}"${attrsWithoutHeight.replace(/width="[^"]*"/, `width="${styleWidthValue}"`)}>`;
        } else {
          // Si no existe, añadir el atributo width
          return `<img${attrsBeforeStyle}style="${updatedStyle}" width="${styleWidthValue}"${attrsWithoutHeight}>`;
        }
      }

      return `<img${attrsBeforeStyle}style="${updatedStyle}"${attrsWithoutHeight}>`;
    });


      console.log('Contenido después de ajustar imágenes:', adjustedWithImageStyles);

      if (this.selectedBlock) {
        this.selectedBlock.properties.text = adjustedWithImageStyles
        this.saveHistory('updateTextBlockContent')
      }
      this.modalEditText.close()
    },
    openPickerImage () {
      this.$refs.imagePropertiesPanel.triggerFileInput()
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
    // Updates rows properties methods
    updateRowBackgroundColor (newColor) {
      if (this.selectedRowIndex !== null) {
        this.rows[this.selectedRowIndex].bgColor = newColor
        this.saveHistory()
      }
    },
    updateRowPadding ({ side, value }) {
      if (this.selectedRowIndex !== null) {
        this.rows[this.selectedRowIndex].padding[side] = value
        this.saveHistory()
      }
    },
    // Updates column properties methods
    updateColumnBackgroundColor (newColor) {
      if (this.selectedRowIndex !== null && this.activeColumn !== null) {
        this.columnBackgroundColor = newColor
        this.rows[this.selectedRowIndex].columns[this.activeColumn].backgroundColor = newColor
        this.saveHistory('updateColumnBorderColor')
      }
    },

    updateColumnPadding ({ side, value }) {
      if (this.selectedRowIndex !== null && this.activeColumn !== null) {
        this.rows[this.selectedRowIndex].columns[this.activeColumn].padding[side] = value
        this.saveHistory('updateColumnPadding')
      }
    },
    updateColumnBorderWidth ({ side, value }) {
      this.rows[this.selectedRowIndex].columns[this.activeColumn].border.width[side] = value
      this.saveHistory('updateColumnBorderWidht')
    },
    updateColumnBorderColor ({ side, value }) {
      this.rows[this.selectedRowIndex].columns[this.activeColumn].border.color[side] = value
      this.saveHistory('updateColumnBorderColor')
    },
    upBlock (index) {
      const content = this.rows[this.selectedBlockRowIndex]?.columns[this.selectedColumnIndex].content
      const temp = content[index];
      content.splice(index, 1);
      content.splice(index - 1, 0, temp);
      this.saveHistory('upBlock')
    },
    downBlock (index) {
      const content = this.rows[this.selectedBlockRowIndex]?.columns[this.selectedColumnIndex].content
      const temp = content[index];
      content.splice(index, 1);
      content.splice(index + 1, 0, temp);
      this.saveHistory('downBlock')
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
              width: proportions[i] || (100 / numColumns) // Ajustar el ancho según proporciones
            }
          : {
              content: [], // Nueva columna sin contenido
              backgroundColor: '#ffffff',
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              border: {
                width: { top: 0, right: 0, bottom: 0, left: 0 },
                color: { top: '#000', right: '#000', bottom: '#000', left: '#000' }
              },
              width: proportions[i] || (100 / numColumns)
            };
      });

      // Asignar la nueva configuración de columnas a la fila seleccionada
      this.rows[this.selectedRowIndex].columns = newColumns;

      // Actualizar las variables de estado
      this.selectedRowColumns = numColumns;
      this.activeColumn = 0;
      this.saveHistory('configure columns')
      console.log(`Fila ${this.selectedRowIndex + 1} configurada con ${numColumns} columnas.`);
    },

    saveHistory(method) {
      console.log('saveHistory', method)
      // Si hay estados futuros, los descartamos (no se pueden "rehacer" tras un nuevo cambio)
      this.history.future = [];
      
      // Guarda el estado actual en el pasado
      if (this.history.present !== null) {
        this.history.past.push(JSON.parse(JSON.stringify(this.history.present)));
      }

      // Limita el historial a 20 versiones
      if (this.history.past.length > 20) {
        this.history.past.shift();
      }

      // Actualiza el estado presente
      this.history.present = JSON.parse(JSON.stringify(this.rows));
    },
    undo() {
      if (this.history.past.length > 0) {
        // Mover el estado actual al futuro
        this.history.future.unshift(JSON.parse(JSON.stringify(this.history.present)));

        // Recuperar el último estado del pasado
        this.history.present = this.history.past.pop();

        // Restaurar el estado de rows
        this.rows = JSON.parse(JSON.stringify(this.history.present));

        this.selectedBlock = null
        this.selectedBlockId = null
      }
    },
    redo() {
      if (this.history.future.length > 0) {
        // Mover el estado actual al pasado
        this.history.past.push(JSON.parse(JSON.stringify(this.history.present)));

        // Recuperar el primer estado del futuro
        this.history.present = this.history.future.shift();

        // Restaurar el estado de rows
        this.rows = JSON.parse(JSON.stringify(this.history.present));

        this.selectedBlock = null
        this.selectedBlockId = null
      }
    },

    getColumnWidthInPixels(rowIndex, columnIndex) {
      const row = this.rows[rowIndex];
      const column = row.columns[columnIndex];
      // Ancho del editor
      const containerWidth = 600;

      // Convertir el ancho relativo (%) de la columna a píxeles
      let columnWidth
      if (typeof column.width === 'number') {
        columnWidth = `${column.width}%`
        columnWidth = parseFloat(columnWidth.replace('%', '')) / 100 * containerWidth;
      } else {
        columnWidth = parseFloat(column.width.replace('%', '')) / 100 * containerWidth;
      }

      // Restar paddings de la columna
      // Review tomar en cuenta bordes
      const totalPadding = column.padding.left + column.padding.right;
      const columnWidthWithoutPadding = columnWidth - totalPadding;

      return columnWidthWithoutPadding;
    },

    saveAndEmitContent (exit = false) {
      const html = this.exportMJMLToHTML()
      const json = this.exportJson()
      this.$emit('save-content', {html: html, json: json}, exit)
    },

    exportMJMLToHTML () {
      const mjmlContent = this.generateMJML();
      console.log(mjmlContent)
      const { html } = mjml2html(mjmlContent, { beautify: true, minify: false });
      const processedHTML = this.postProcessHTML(html);
      // console.log(processedHTML)
      return processedHTML;
    },
    generateMJML() {
      let mjmlContent = `
        <mjml>
            <mj-head>
                <mj-attributes>
                  <mj-image fluid-on-mobile="true" />
                </mj-attributes>
              <mj-style>
                a { color: rgb(25, 115, 184); text-decoration: none; font-weight: bold; }
              </mj-style>
            </mj-head>
          <mj-body>
            <mj-wrapper>
      `;

      this.rows.forEach((row, rowIndex) => {
        mjmlContent += `
          <mj-section
            width="600px"
            background-color="${row.bgColor || '#ffffff'}"
            padding="${row.padding.top}px ${row.padding.right}px ${row.padding.bottom}px ${row.padding.left}px"
          >
        `;

        const onlyOneColumn = row.columns.length === 1

        row.columns.forEach((column, columnIndex) => {
          // Verificar si todas las columnas tienen un solo bloque y es de tipo 'button'
          const isButtonRow = row.columns.every(col => 
            col.content.length === 1 && col.content[0].type === 'button'
          );

          // Añadir la clase CSS si cumple la condición
          const cssClass = isButtonRow || onlyOneColumn ? 'not-table-cell' : '';
          mjmlContent += `
            <mj-column
              ${cssClass ? `css-class="${cssClass}"` : ''}
              width="${column.width}%"
              background-color="${column.backgroundColor || '#ffffff'}"
              padding="${column.padding.top}px ${column.padding.right}px ${column.padding.bottom}px ${column.padding.left}px"
              border-top="${column.border.width.top}px solid ${column.border.color.top}"
              border-right="${column.border.width.right}px solid ${column.border.color.right}"
              border-bottom="${column.border.width.bottom}px solid ${column.border.color.bottom}"
              border-left="${column.border.width.left}px solid ${column.border.color.left}"
            >
          `;

          column.content.forEach(block => {
            if (block.type === 'button') {
              const hrefAttribute = block.properties.href ? `href="${block.properties.href}"` : '';
              mjmlContent += `
                <mj-button
                  ${hrefAttribute}
                  font-family="Arial, sans-serif"
                  background-color="${block.properties.backgroundColor || '#1973b8'}"
                  color="${block.properties.color || '#ffffff'}"
                  padding="${block.properties.padding || '12px 32px'}"
                  border-radius="${block.properties.borderRadius || '1px'}"
                  align="${block.properties.alignment || 'center'}"
                >
                  ${block.properties.text}
                </mj-button>
              `;
            } else if (block.type === 'text') {
              mjmlContent += `
                <mj-text
                  font-size="${block.properties.fontSize || '14px'}"
                  line-height="${block.properties.lineHeight}px"
                  color="${block.properties.color || '#000000'}"
                  padding="${block.properties.containerPadding.top}px ${block.properties.containerPadding.right}px ${block.properties.containerPadding.bottom}px ${block.properties.containerPadding.left}px"
                  align="${block.properties.alignment || 'left'}"
                >
                  ${block.properties.text}
                </mj-text>
              `;
            } else if (block.type === 'image') {
              const columnWidth = this.getColumnWidthInPixels(rowIndex, columnIndex);
              const imagePadding = Number(block.properties.containerPadding.left) + Number(block.properties.containerPadding.right);
              const imageWidthPx = Math.max(0, Math.round((block.properties.width / 100 * (columnWidth - imagePadding))));
              const hrefAttribute = block.properties.href ? `href="${block.properties.href}"` : '';
              mjmlContent += `
                <mj-image
                  ${hrefAttribute}
                  src="${block.properties.src}"
                  alt="${block.properties.alt || ''}"

                  align="${block.properties.alignment}"
                  padding="${block.properties.containerPadding.top}px ${block.properties.containerPadding.right}px ${block.properties.containerPadding.bottom}px ${block.properties.containerPadding.left}px"
                />
              `;
            }
          });

          mjmlContent += `
            </mj-column>
          `;
        });

        mjmlContent += `
          </mj-section>
        `;
      });

      mjmlContent += `
            </mj-wrapper>
          </mj-body>
        </mjml>
      `;

      return mjmlContent;
    },
    postProcessHTML(html) {
      // Usar DOMParser para trabajar con el documento completo
      const parser = new DOMParser();
      const doc = parser.parseFromString(html, 'text/html');
      // Asegurar display: table-cell y height: 100%
      const columns = doc.querySelectorAll('td');
      columns.forEach(column => {
        column.style.height = '100%';
        column.style.display = 'table-cell';
      });

      // Selecciona todos los elementos con clase que comienza con "mj-column-per"
      const mjColumns = doc.querySelectorAll('[class^="mj-column-per"]:not(.not-table-cell)');

      mjColumns.forEach(column => {
        // Añadir clase "desktop-table-cell" para manejar con media queries
        column.classList.add('desktop-table-cell');

        // Encuentra el primer td descendiente
        const firstTd = column.querySelector('td');

        if (firstTd) {
          // Extrae el background-color del td y lo aplica al elemento de la clase mj-column-per
          const tdStyle = firstTd.getAttribute('style');
          if (tdStyle) {
            const bgColorMatch = tdStyle.match(/background-color:\s*([^;]+)/);
            if (bgColorMatch) {
              const bgColor = bgColorMatch[1];
              column.style.backgroundColor = bgColor;
            }
          }
        }
      });
      // Serializar el documento completo
      
      mjColumns.forEach(column => {
        // Extraer el número xx de la clase mj-column-per-xx
        const className = Array.from(column.classList).find(cls => cls.startsWith('mj-column-per-'));
        if (className) {
          const percentage = className.split('-').pop();
          const existingStyle = column.getAttribute('style') || '';
          const newStyles = `width: ${percentage}%; max-width: ${percentage}%;`;
          column.setAttribute('style', `${existingStyle} ${newStyles}`);
        }
      });
      // Añadir CSS al documento procesado
      const styleContent = `
        @media only screen and (min-width: 400px) {
          .desktop-table-cell {
            display: table-cell !important;
          }
          .mj-column-per-50 {
            min-width: ${this.minWidth[50]}
          }
          .mj-column-per-67 {
            min-width: ${this.minWidth[67]}
          }
          .mj-column-per-33 {
            min-width: ${this.minWidth[33]}
          }
          .mj-column-per-33-333333333333336 {
            min-width: ${this.minWidth[33]}
          }
        }
        @media only screen and (max-width: 399px) {
          .desktop-table-cell {
            display: block !important;
            width: 100% !important;
            max-width: 100% !important;
          }
        }
      `;

  const styleElement = doc.createElement('style');
  styleElement.textContent = styleContent;

  // Insertar el <style> en el <head> del documento
  const head = doc.querySelector('head') || doc.createElement('head');
  head.appendChild(styleElement);
      return `<!DOCTYPE html>\n${doc.documentElement.outerHTML}`;
    },
    exportJson () {
      const templateData = JSON.stringify(this.rows)
      return templateData
    },
    loadTemplate (template) {
      this.rows = [...template]
    },

    generateButtonHtml (block) {
      const alignmentStyle = block.properties.alignment ? `text-align: ${block.properties.alignment};` : ''
      const hrefAttribute = block.properties.href ? `href="${block.properties.href}"` : '';

      return `
        <div style="${alignmentStyle}">
          <a ${hrefAttribute} style="display: inline-block; background-color: ${block.properties.backgroundColor}; color: ${block.properties.color}; padding: ${block.properties.padding}; border-radius: ${block.properties.borderRadius}; text-decoration: none;">
            ${block.properties.text}
          </a>
        </div>
      `
    },

    showPreview () {
      this.htmlForPreview = this.exportMJMLToHTML()
      this.showPreviewContent = true
    },
    closePreview () {
      this.htmlForPreview = ''
      this.showPreviewContent = false
    },
    exit () {
      this.$emit('exit')
    }
  }
}
</script>

<style scoped lang="scss">
  @import '@/assets/scss/_variables.scss';
  @import '@/assets/scss/_mixins.scss';
.wrapper {
  display: grid;
  grid-template-columns: 4fr 2fr;
}
/* Estilos para el lienzo */

.editor-layout {
  height: 100vh;
  overflow-y: scroll;
}
.canvas {
  background-color: #f9f9f9;
  border: 1px solid #ddd;
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

.row-selected {
  outline: 2px solid #1464A5;
  outline-offset: -1px;
  z-index: 1;
}

/* Indicador de arrastre */
.drag-handle {
  position: absolute;
  top: 50%;
  right: 0px;
  transform: translateY(-50%);
  background-color: $bbva-medium-light-blue;
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
  font-size: 22px;
  cursor: pointer;
  color: $bbva-core-blue;
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
  width: 48%;
  background-color: #ffffff;
  border: 1px solid #ccc;
  display: flex;
  justify-content: center;
}

.column > div {
  width: 100%;
  max-width: 600px;
  z-index: 1;
}

.column p {
  margin: 0;
}

.lateral-panel {
  display: flex;
  flex-direction: column;
  position: sticky;
  top: 0;
  overflow-y: auto;
  background-color: #ffff;
  border-top: solid 1px #ddd;
  border-right: solid 1px #ddd;
}

.row {
  display: flex;
  gap: 10px;
}

.z-index-row {
  z-index: 20;
}

.columns-container {
  width: 600px;
  margin: 0 auto;
  display: flex;
  gap: 0;
}

.column-outlined {
  outline: 1px blue dashed;
  outline-offset: -1px;
}

.column-min-height {
  min-height: 100px;
}

.single-column {
  display: flex;
  justify-content: center;
}

.single-column .column {
  width: 100%;
}

.two-columns {
  display: flex;
  gap: 10px;
}

.two-columns .column {
  width: 50%;
}

.two-columns-67-33 .column:nth-child(1) {
  width: 67%;
}

.two-columns-67-33 .column:nth-child(2) {
  width: 33%;
}

.two-columns-33-67 .column:nth-child(1) {
  width: 33%;
}

.two-columns-33-67 .column:nth-child(2) {
  width: 67%;
}

.three-columns {
  display: flex;
  gap: 10px;
}

.three-columns .column {
  width: 33.33%;
}

.four-columns {
  display: flex;
  gap: 10px;
}

.four-columns .column {
  width: 25%;
}

</style>
