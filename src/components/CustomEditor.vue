<template>
  <div>
    <div class="wrapper">
      <div>
        <HeaderPanel
          @clear-canvas="openModalConfirm('clearCanvas')"
          :disableUndo="!history.past.length > 0"
          :disableRedo="!history.future.length > 0"
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
                { 'z-index-row': this.selectedRowIndex === rowIndex || this.selectedBlockRowIndex === rowIndex },
                getColumnClass(row.columns.length, row.columns[0].width),
              ]"
              @click="selectRow(rowIndex, $event)"
            >
              <AddRowButton v-if="rowIndex === rows.length - 1" @add-row="addRow" />

              <!-- Panel de acciones de la fila -->
              <div v-if="row.isSelected" class="row-action-panel">
                <v-tooltip v-if="rowIndex !== 0" content-class="tooltip" location="bottom">
                  <template v-slot:activator="{ props }">
                    <button
                      v-bind="props"
                      class="block-action-icon mdi mdi-chevron-up"
                      :style="{ fontSize: '26px' }"
                      @click.stop="upRow(rowIndex)"
                    ></button>
                  </template>
                  <span>{{ $t('EDITOR.UP_ROW') }}</span>
                </v-tooltip>

                <v-tooltip v-if="rowIndex !== rows.length - 1" content-class="tooltip" location="bottom">
                  <template v-slot:activator="{ props }">
                    <button
                      v-bind="props"
                      class="block-action-icon mdi mdi-chevron-down"
                      :style="{ fontSize: '26px' }"
                      @click.stop="downRow(rowIndex)"
                    ></button>
                  </template>
                  <span>{{ $t('EDITOR.DOWN_ROW') }}</span>
                </v-tooltip>

                <v-tooltip content-class="tooltip" location="bottom">
                  <template v-slot:activator="{ props }">
                    <button
                      class="row-action-icon mdi mdi-delete"
                      v-bind="props"
                      @click="handleDeleteRow(rowIndex)"
                    ></button>
                  </template>
                  <span>{{ $t('COMMON.DELETE') }}</span>
                </v-tooltip>

                <v-tooltip content-class="tooltip" location="bottom">
                  <template v-slot:activator="{ props }">
                    <button
                      class="row-action-icon mdi mdi-content-copy"
                      v-bind="props"
                      @click="handleDuplicateRow(rowIndex)"
                    ></button>
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
                    borderLeft: `${column.border.width?.left}px solid ${column.border.color.left}`,
                  }"
                  :class="{ 'column-outlined': !column.content.length, 'column-min-height': !column.content.length }"
                  @dragover.prevent
                  @drop="addBlockToCanvas(rowIndex, columnIndex)"
                >
                  <div v-if="column.content.length">
                    <BlockRenderer
                      v-for="(block, index) in column.content"
                      :key="block.blockId"
                      :block="block"
                      :isSelected="selectedBlockId === block.blockId"
                      :showUpBtn="index !== 0 && column.content.length > 1"
                      :showDownBtn="index !== column.content.length - 1"
                      @block-selected="handleBlockSelection"
                      @delete-block="handleDeleteBlock"
                      @duplicate-block="handleDuplicateBlock"
                      @up-block="upBlock(index)"
                      @down-block="downBlock(index)"
                      @edit-text="openModalEditText(block)"
                      @upload-image="openPickerImage()"
                    />
                  </div>
                  <p v-else :style="{ 'align-self': 'center' }">{{ $t('EDITOR.EMPTY_COLUMN_TEXT') }}</p>
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
            :emptyRowSelected="emptyRowSelected"
            @configure-columns="handleConfigureColumns"
          />
          <Predefined-rows-panel
            v-if="selectedRowIndex !== null"
            :emptyRowSelected="emptyRowSelected"
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
            @add-column="handleConfigureColumns"
            @remove-column="handleConfigureColumns"
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
    ></modal>

    <EditTextDialog
      v-if="modalEditText.shown"
      class="modal-ckeditor"
      @confirm="updateTextBlockContent"
      @close="modalEditText.close"
    >
      <InlineEditor
        :initialContent="modalEditText.originalText"
        :bgColor="modalEditText.backgroundColor"
        @updateContent="updateNewText"
      />
    </EditTextDialog>

    <PreviewContent :showPreview="showPreviewContent" :template="htmlForPreview" @close="closePreview"></PreviewContent>
  </div>
</template>

<script>
import mjml2html from 'mjml-browser';
import InlineEditor from './InlineEditor.vue';

import ConfigureColumnsPanel from './lateralPanelComponents/ConfigureColumnsPanel.vue';
import ColumnPropertiesPanel from './lateralPanelComponents/ColumnPropertiesPanel.vue';
import RowPropertiesPanel from './lateralPanelComponents/RowPropertiesPanel.vue';
import ColumnTabs from './lateralPanelComponents/ColumnTabs.vue';
import ToolsPanel from './lateralPanelComponents/ToolsPanel.vue';
import PredefinedRowsPanel from './lateralPanelComponents/PredefinedRowsPanel.vue';
import ButtonPropertiesPanel from './lateralPanelComponents/ButtonPropertiesPanel.vue';
import TextPropertiesPanel from './lateralPanelComponents/TextPropertiesPanel.vue';
import ImagePropertiesPanel from './lateralPanelComponents/ImagePropertiesPanel.vue';

import AddRowButton from './auxiliarComponents/AddRowButton.vue';
import HeaderPanel from './auxiliarComponents/HeaderPanel.vue';
import ActionsButtonPanel from '_editor/auxiliarComponents/ActionsButtonsPanel.vue';

import BlockRenderer from './BlockRenderer.vue';
import EditTextDialog from './auxiliarComponents/EditTextDialog.vue';
import PreviewContent from './auxiliarComponents/PreviewContent.vue';
import Modal from './Modal.vue';

import { generateButtonBlock, generateImgBlock, generateTextBlock } from '_editor/generateBlocksFunctions';
import {
  generateTwoColumnstructure,
  generateThreeColumnstructure,
  generateThreeSevenStructure,
  generateSevenThreeStructure,
} from '_editor/generateCustomRowsFunctions.js';

import { generateMJML, postProcessHTML } from '_utils/exportHtmlFunctions.js';
import {
  moveItem,
  deleteBlockFromContent,
  duplicateBlockInContent,
  deleteRowAtIndex,
  duplicateRowAtIndex,
} from '@/utils/editorArrayUtils';

import { saveHistoryState, undoState, redoState } from '@/utils/historyManager';
import { getColumnClass, configureColumns } from '@/utils/editorLayoutUtils';

export default {
  mounted() {
    // Intercepta todos los clics en enlaces dentro del editor
    this.$refs.editorContainer.addEventListener('click', this.preventLinkNavigation);
    this.saveHistory();
    this.selectRow(0);
  },

  beforeUnmount() {
    this.$refs.editorContainer.removeEventListener('click', this.preventLinkNavigation);
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

  data() {
    return {
      showCkeditor: false,
      selectedColumnIndex: null,
      selectedBlockId: null,
      selectedRowIndex: null,
      selectedBlockRowIndex: null,
      activeColumn: null,
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
          columns: [
            {
              content: [],
              width: 100,
              backgroundColor: '#ffffff',
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              border: {
                width: { top: 0, right: 0, bottom: 0, left: 0 },
                color: { top: '#000000', right: '#000000', bottom: '#000000', left: '#000000' },
              },
            },
          ],
        },
      ],
      history: {
        past: [],
        present: null,
        future: [],
      },
      minWidth: {
        50: '260px',
        33: '171px',
        67: '348px',
        100: '520px',
      },
      editingText: false,
      showPreviewContent: false,
      htmlForPreview: '',
      modalConfirm: {
        shown: false,
        action: null,
        close: () => {
          this.modalConfirm.action = null;
          this.modalConfirm.shown = false;
        },
      },
      // CKEDITOR
      modalEditText: {
        shown: false,
        originalText: null,
        backgroundColor: '',
        close: () => {
          this.modalEditText.originalText = null;
          this.modalEditText.shown = false;
          this.modalEditText.backgroundColor = '';
        },
      },
      draggedRowIndex: null,
    };
  },
  computed: {
    selectedRowColumns() {
      return this.rows[this.selectedRowIndex]?.columns.length;
    },
    emptyRowSelected() {
      return this.rows[this.selectedRowIndex]?.columns.every(
        (column) => !column.content || column.content.length === 0
      );
    },
  },
  methods: {
    preventLinkNavigation(event) {
      const target = event.target.closest('a'); // Verificamos si el clic fue en un enlace

      if (target && target.closest('.block-wrapper')) {
        // Si el enlace está dentro del editor (e.g., en un .block-wrapper), prevenimos la redirección
        event.preventDefault();
      }
    },

    openModalConfirm(action) {
      this.modalConfirm.action = action;
      this.modalConfirm.shown = true;
    },

    handleModalConfirmAction() {
      this[this.modalConfirm.action]();
      this.modalConfirm.close();
    },

    handleDragStart(type, colorDraggedBtn = null) {
      this.dragItemType = type;
      this.colorDraggedBtn = colorDraggedBtn;
    },

    hasContentInRow(index) {
      return this.rows[index].columns.some((column) => column.content.length > 0);
    },

    addRowWithContent(content) {
      this.addRow();
      this.rows[this.rows.length - 1] = content;
      this.selectRow(this.rows.length - 1);
    },

    addBlockToCanvas(rowIndex, columnIndex) {
      if (!this.dragItemType) return;

      const blockId = `${this.dragItemType}-${Date.now()}`;

      let newBlock;
      if (this.dragItemType === 'button') {
        newBlock = generateButtonBlock(this.colorDraggedBtn);
      } else if (this.dragItemType === 'text') {
        newBlock = generateTextBlock();
      } else if (this.dragItemType === 'image') {
        newBlock = generateImgBlock();
      }

      if (this.dragItemType === 'threeSeven') {
        const structure = generateThreeSevenStructure();
        this.handleAddStructureToCanvas(structure, rowIndex);
      }

      if (this.dragItemType === 'sevenThree') {
        const structure = generateSevenThreeStructure();
        this.handleAddStructureToCanvas(structure, rowIndex);
      }

      if (this.dragItemType === 'two-column') {
        const structure = generateTwoColumnstructure();
        this.handleAddStructureToCanvas(structure, rowIndex);
      }

      if (this.dragItemType === 'three-column') {
        const structure = generateThreeColumnstructure();
        this.handleAddStructureToCanvas(structure, rowIndex);
      }
      // Actualizamos el contenido de la columna con el bloque JSON
      if (newBlock) {
        this.rows[rowIndex].columns[columnIndex].content.push(newBlock);
        this.handleBlockSelection(blockId);
      }
      // Reseteamos el tipo de bloque arrastrado
      this.dragItemType = null;
      this.saveHistory('createBlock');
    },
    handleAddStructureToCanvas(structure, rowIndex) {
      if (this.hasContentInRow(rowIndex)) {
        this.addRowWithContent(structure);
      } else {
        this.rows[rowIndex] = structure;
        this.selectRow(rowIndex);
      }
    },
    clearCanvas() {
      // Limpiamos todas las filas
      this.rows = [
        {
          isSelected: false,
          bgColor: '#ffffff',
          padding: { top: 10, right: 40, bottom: 10, left: 40 },
          columns: [
            {
              content: [],
              backgroundColor: '#ffffff',
              width: 100,
              padding: { top: 0, right: 0, bottom: 0, left: 0 },
              border: {
                width: { top: 0, right: 0, bottom: 0, left: 0 },
                color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
              },
            },
          ],
        },
      ];
      this.selectedRowIndex = null;
      this.activeColumn = null;
      this.selectedBlock = null;
      this.selectRow(0);
    },
    addRow() {
      this.rows.push({
        isSelected: false,
        bgColor: '#ffffff',
        padding: { top: 10, right: 40, bottom: 10, left: 40 },
        columns: [
          {
            width: 100,
            content: [],
            backgroundColor: '#ffffff',
            padding: { top: 0, right: 0, bottom: 0, left: 0 },
            border: {
              width: { top: 0, right: 0, bottom: 0, left: 0 },
              color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
            },
          },
        ],
      });
      this.selectRow(this.rows.length - 1);
      this.saveHistory();
    },
    handleDeleteRow(rowIndex) {
      const updatedRows = deleteRowAtIndex(this.rows, rowIndex);
      if (updatedRows !== this.rows) {
        this.rows = updatedRows;
        this.selectedRowIndex = null;
        this.activeColumn = null;
        this.saveHistory();
      }
    },
    handleDuplicateRow(rowIndex) {
      this.rows = duplicateRowAtIndex(this.rows, rowIndex);
      this.saveHistory();
    },
    selectRow(index, event) {
      const clickedElement = event?.target.closest('.block-wrapper'); // Detecta si el clic fue en un bloque

      if (clickedElement) {
        // Si el clic fue en un bloque, no seleccionamos la fila
        return;
      }
      // Deseleccionamos todas las filas primero
      this.rows.forEach((row, i) => {
        row.isSelected = i === index;
      });

      this.selectedBlockRowIndex = null;

      // Deseleccionar bloque
      this.selectedBlock = null;
      this.selectedBlockId = null;

      // Actualizamos el índice de la fila seleccionada
      this.selectedRowIndex = index;
      this.selectColumn(0);
    },
    upRow(index) {
      const newRows = moveItem(this.rows, index, index - 1);
      this.rows = newRows;
      this.selectRow(index - 1);
    },
    downRow(index) {
      const newRows = moveItem(this.rows, index, index + 1);
      this.rows = newRows;
      this.selectRow(index + 1);
    },
    selectColumn(index) {
      this.activeColumn = index;
      this.columnBackgroundColor = this.rows[this.selectedRowIndex].columns[this.activeColumn].backgroundColor;
    },
    handleBlockSelection(blockId) {
      // Iterar sobre filas y columnas para encontrar el bloque con el blockId
      for (let rowIndex = 0; rowIndex < this.rows.length; rowIndex++) {
        const row = this.rows[rowIndex];
        for (let columnIndex = 0; columnIndex < row.columns.length; columnIndex++) {
          const column = row.columns[columnIndex];
          const block = column.content.find((block) => block.blockId === blockId);

          if (block) {
            // Bloque encontrado, guardar referencias
            const isText = blockId.includes('text');
            const isButton = blockId.includes('button');
            this.selectedRowIndex = null;
            this.selectedBlockRowIndex = rowIndex;
            this.selectedColumnIndex = columnIndex;
            this.selectedBlockId = blockId;
            this.selectedBlock = block; // Guarda el bloque para futuras modificaciones
            // Deseleccionamos todas las filas primero
            this.rows.forEach((row, i) => {
              row.isSelected = false;
            });

            this.activeColumn = null;

            if (isButton) {
              this.buttonText = this.selectedBlock.properties.text; // Asigna el texto del botón
              this.buttonLink = this.selectedBlock.properties.href; // Asigna el href del botón
            }
            return;
          }
        }
      }
    },

    handleDeleteBlock(blockId) {
      const column = this.getColumnFromBlockId(blockId);
      if (column) {
        column.content = deleteBlockFromContent(column.content, blockId);
      }
      this.saveHistory();
    },

    handleDuplicateBlock(blockId) {
      const column = this.getColumnFromBlockId(blockId);
      if (column) {
        column.content = duplicateBlockInContent(column.content, blockId);
      }
      this.saveHistory();
    },

    getColumnFromBlockId(blockId) {
      for (const row of this.rows) {
        for (const column of row.columns) {
          if (column.content.some((block) => block.blockId === blockId)) {
            return column;
          }
        }
      }
      return null;
    },

    updateContainerPadding({ side, value }) {
      if (this.selectedBlock) {
        this.selectedBlock.properties.containerPadding[side] = value;
      }
      this.saveHistory('updateContainerPadding');
    },

    updateButtonText(newText) {
      if (this.selectedBlock) {
        this.selectedBlock.properties.text = newText;
      }
      this.saveHistory();
    },
    updateButtonHref(newHref) {
      if (this.selectedBlock && this.selectedBlock.type === 'button') {
        this.selectedBlock.properties.href = newHref;
        this.saveHistory();
      }
    },
    updateTextLineHeight(lh) {
      if (this.selectedBlock && this.selectedBlock.type === 'text') {
        this.selectedBlock.properties.lineHeight = lh;
        this.saveHistory();
      }
    },
    updateImageHref(newHref) {
      if (this.selectedBlock && this.selectedBlock.type === 'image') {
        this.selectedBlock.properties.href = newHref;
        this.saveHistory();
      }
    },
    updateImageWidth(newWidth) {
      if (this.selectedBlock && this.selectedBlock.type === 'image') {
        this.selectedBlock.properties.width = newWidth;
        this.saveHistory();
      }
    },
    updateImageSrc(newSrc) {
      if (this.selectedBlock && this.selectedBlock.type === 'image') {
        this.selectedBlock.properties.src = newSrc;
        this.saveHistory();
      }
    },
    updateBlockAligment(alignment) {
      this.saveHistory();
      this.selectedBlock.properties.alignment = alignment;
    },
    openModalEditText(block) {
      this.modalEditText.originalText = block.properties?.text;
      this.modalEditText.backgroundColor =
        this.rows[this.selectedBlockRowIndex].columns[this.selectedColumnIndex].backgroundColor;
      this.modalEditText.shown = true;
      this.editingText = true;
    },
    updateNewText(newText) {
      this.modalEditText.newText = newText;
    },
    updateTextBlockContent() {
      let newContent = this.modalEditText.newText;

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

      // Ajustar imágenes dentro de <figure>
      const adjustedWithFigureStyles = adjustedContent.replace(
        /<figure([^>]*)style="([^"]*)"[^>]*>\s*<img([^>]*)style="([^"]*)"/g,
        (match, figureAttrs, figureStyle, imgAttrs, imgStyle) => {
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
        }
      );

      // Asegurar de que las imágenes tienen height: auto en su estilo
      const adjustedWithImageStyles = adjustedWithFigureStyles.replace(
        /<img([^>]*)style="([^"]*)"([^>]*)>/g,
        (match, attrsBeforeStyle, style, attrsAfterStyle) => {
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
        }
      );

      if (this.selectedBlock) {
        this.selectedBlock.properties.text = adjustedWithImageStyles;
        this.saveHistory();
      }
      this.modalEditText.close();
    },
    openPickerImage() {
      this.$refs.imagePropertiesPanel.triggerFileInput();
    },
    // Updates rows properties methods
    updateRowBackgroundColor(newColor) {
      if (this.selectedRowIndex !== null) {
        this.rows[this.selectedRowIndex].bgColor = newColor;
        this.saveHistory();
      }
    },
    updateRowPadding({ side, value }) {
      if (this.selectedRowIndex !== null) {
        this.rows[this.selectedRowIndex].padding[side] = value;
        this.saveHistory();
      }
    },
    // Updates column properties methods
    updateColumnBackgroundColor(newColor) {
      if (this.selectedRowIndex !== null && this.activeColumn !== null) {
        this.columnBackgroundColor = newColor;
        this.rows[this.selectedRowIndex].columns[this.activeColumn].backgroundColor = newColor;
        this.saveHistory();
      }
    },

    updateColumnPadding({ side, value }) {
      if (this.selectedRowIndex !== null && this.activeColumn !== null) {
        this.rows[this.selectedRowIndex].columns[this.activeColumn].padding[side] = value;
        this.saveHistory();
      }
    },
    updateColumnBorderWidth({ side, value }) {
      this.rows[this.selectedRowIndex].columns[this.activeColumn].border.width[side] = value;
      this.saveHistory();
    },
    updateColumnBorderColor({ side, value }) {
      this.rows[this.selectedRowIndex].columns[this.activeColumn].border.color[side] = value;
      this.saveHistory();
    },
    upBlock(index) {
      const content = this.rows[this.selectedBlockRowIndex]?.columns[this.selectedColumnIndex].content;
      if (!content) return;

      const newContent = moveItem(content, index, index - 1);
      this.rows[this.selectedBlockRowIndex].columns[this.selectedColumnIndex].content = newContent;

      this.saveHistory();
    },
    downBlock(index) {
      const content = this.rows[this.selectedBlockRowIndex]?.columns[this.selectedColumnIndex].content;
      if (!content) return;

      const newContent = moveItem(content, index, index + 1);
      this.rows[this.selectedBlockRowIndex].columns[this.selectedColumnIndex].content = newContent;

      this.saveHistory();
    },
    getColumnClass,
    handleConfigureColumns(numColumns, proportions = []) {
      if (this.selectedRowIndex === null) return;

      const currentColumns = this.rows[this.selectedRowIndex].columns;
      const newColumns = configureColumns(numColumns, proportions, currentColumns);

      this.rows[this.selectedRowIndex].columns = newColumns;
      this.activeColumn = 0;
      this.saveHistory();
    },

    saveHistory() {
      saveHistoryState(this.history, this.rows);
    },
    undo() {
      const previous = undoState(this.history);
      if (previous) {
        this.rows = previous;
        this.selectedBlock = null;
        this.selectedBlockId = null;
      }
    },
    redo() {
      const next = redoState(this.history);
      if (next) {
        this.rows = next;
        this.selectedBlock = null;
        this.selectedBlockId = null;
      }
    },

    exportMJMLToHTML() {
      const mjml = generateMJML(this.rows);
      const { html } = mjml2html(mjml, { beautify: true, minify: false });
      const processedHTML = postProcessHTML(html);
      return processedHTML;
    },

    showPreview() {
      this.htmlForPreview = this.exportMJMLToHTML();
      this.showPreviewContent = true;
    },
    closePreview() {
      this.htmlForPreview = '';
      this.showPreviewContent = false;
    },
  },
};
</script>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';
@import '@/assets/scss/_mixins.scss';
.wrapper {
  display: grid;
  grid-template-columns: 4fr 2fr;
}

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
  position: relative;
  padding: 0 20px;
  text-align: center;
  cursor: pointer;
  box-sizing: border-box;
}

.row-selected {
  outline: 2px solid #1464a5;
  outline-offset: -1px;
  z-index: 1;
}

.row-action-panel {
  z-index: 4;
  position: absolute;
  top: 100%;
  right: 0px;
  display: flex;
  gap: 8px;
  padding: 4px;
  background-color: white;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-shadow: 0px 2px 8px rgba(0, 0, 0, 0.15);
}

.row-action-icon {
  font-size: 22px;
  cursor: pointer;
  color: $core-blue;
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
