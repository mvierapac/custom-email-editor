<template>
  <div>
    <div class="wrapper">
      <div>
        <HeaderPanel
          @clear-canvas="() => openModalConfirm(clearCanvas)"
          :disableUndo="!history.past.length > 0"
          :disableRedo="!history.future.length > 0"
          @undo="undo"
          @redo="redo"
          @show-preview="showPreview"
        />
        <div class="editor-layout">
          <div class="canvas" ref="editorContainer" @click.capture="preventLinkNavigation">
            <div
              v-for="(row, rowIndex) in rows"
              :key="rowIndex"
              :class="[
                'row',
                { 'row-selected': row.isSelected },
                { 'z-index-row': selectedRowIndex === rowIndex || selectedBlockRowIndex === rowIndex },
                getColumnClass(row.columns.length, row.columns[0].width),
              ]"
              @click="(event) => selectRow(rowIndex, event)"
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
                      @click.stop="() => upRow(rowIndex)"
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
                      @click.stop="() => downRow(rowIndex)"
                    ></button>
                  </template>
                  <span>{{ $t('EDITOR.DOWN_ROW') }}</span>
                </v-tooltip>

                <v-tooltip content-class="tooltip" location="bottom">
                  <template v-slot:activator="{ props }">
                    <button
                      class="row-action-icon mdi mdi-delete"
                      v-bind="props"
                      @click.stop="() => handleDeleteRow(rowIndex)"
                    ></button>
                  </template>
                  <span>{{ $t('COMMON.DELETE') }}</span>
                </v-tooltip>

                <v-tooltip content-class="tooltip" location="bottom">
                  <template v-slot:activator="{ props }">
                    <button
                      class="row-action-icon mdi mdi-content-copy"
                      v-bind="props"
                      @click.stop="() => handleDuplicateRow(rowIndex)"
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
                  @drop="() => addBlockToCanvas(rowIndex, columnIndex)"
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
                      @up-block="() => upBlock(index)"
                      @down-block="() => downBlock(index)"
                      @edit-text="() => openModalEditText(block)"
                      @upload-image="() => openPickerImage()"
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

<script setup>
import { ref, reactive, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import mjml2html from 'mjml-browser';

// Componentes
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

// Funciones externas
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
import { getCurrentInstance } from 'vue';

const instance = getCurrentInstance()?.proxy;

// Referencias DOM
const editorContainer = ref(null);
const toolsPanel = ref(null);
const imagePropertiesPanel = ref(null);

// Estado reactivo
const showCkeditor = ref(false);
const selectedColumnIndex = ref(null);
const selectedBlockId = ref(null);
const selectedRowIndex = ref(null);
const selectedBlockRowIndex = ref(null);
const activeColumn = ref(null);
const dragItemType = ref(null);
const colorDraggedBtn = ref(null);
const selectedBlock = ref(null);
const columnBackgroundColor = ref('#FFFFFF');
const buttonText = ref('');
const buttonLink = ref('');

const rows = reactive([
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
]);

const history = reactive({
  past: [],
  present: null,
  future: [],
});

const minWidth = reactive({
  50: '260px',
  33: '171px',
  67: '348px',
  100: '520px',
});

const editingText = ref(false);
const showPreviewContent = ref(false);
const htmlForPreview = ref('');

const modalConfirm = reactive({
  shown: false,
  action: null,
  close: () => {
    modalConfirm.action = null;
    modalConfirm.shown = false;
  },
});

const modalEditText = reactive({
  shown: false,
  originalText: null,
  backgroundColor: '',
  newText: '',
  close: () => {
    modalEditText.originalText = null;
    modalEditText.shown = false;
    modalEditText.backgroundColor = '';
  },
});

const draggedRowIndex = ref(null);

// Computed
const selectedRowColumns = computed(() => rows[selectedRowIndex.value]?.columns.length);
const emptyRowSelected = computed(() =>
  rows[selectedRowIndex.value]?.columns.every((column) => !column.content || column.content.length === 0)
);

import { useBlockEditor } from '_composables/useBlockEditor';
const { updateContainerPadding, updateBlockAligment, handleDeleteBlock, handleDuplicateBlock, upBlock, downBlock } =
  useBlockEditor({
    selectedBlock,
    saveHistory,
    getColumnFromBlockId,
    selectedBlockRowIndex,
    selectedColumnIndex,
    rows,
    saveHistory,
  });

import { useButtonBlockEditor } from '@/composables/useButtonBlockEditor';
const { updateButtonText, updateButtonHref } = useButtonBlockEditor(selectedBlock, saveHistory);

import { useImageBlockEditor } from '@/composables/useImageBlockEditor';
const { updateImageHref, updateImageWidth, updateImageSrc } = useImageBlockEditor(selectedBlock, saveHistory);

// Lifecycle
onMounted(() => {
  editorContainer.value?.addEventListener('click', preventLinkNavigation);
  saveHistory();
  selectRow(0);
});

onBeforeUnmount(() => {
  editorContainer.value?.removeEventListener('click', preventLinkNavigation);
});

function preventLinkNavigation(event) {
  const target = event.target;
  if (target.tagName === 'A' && target.href) {
    event.preventDefault();
  }
}

function addBlockToCanvas(rowIndex, columnIndex) {
  if (!dragItemType.value) return;

  const blockId = `${dragItemType.value}-${Date.now()}`;
  let newBlock = null;

  switch (dragItemType.value) {
    case 'button':
      newBlock = generateButtonBlock();
      break;
    case 'text':
      newBlock = generateTextBlock();
      break;
    case 'image':
      newBlock = generateImgBlock();
      break;
    case 'threeSeven':
      handleAddStructureToCanvas(generateThreeSevenStructure(), rowIndex);
      break;
    case 'sevenThree':
      handleAddStructureToCanvas(generateSevenThreeStructure(), rowIndex);
      break;
    case 'two-column':
      handleAddStructureToCanvas(generateTwoColumnstructure(), rowIndex);
      break;
    case 'three-column':
      handleAddStructureToCanvas(generateThreeColumnstructure(), rowIndex);
      break;
  }

  if (newBlock) {
    rows[rowIndex].columns[columnIndex].content.push(newBlock);
    handleBlockSelection(blockId);
  }

  dragItemType.value = null;
  saveHistory('createBlock');
}

function handleAddStructureToCanvas(structure, rowIndex) {
  if (hasContentInRow(rowIndex)) {
    addRowWithContent(structure);
  } else {
    rows[rowIndex] = structure;
    selectRow(rowIndex);
  }
}

function hasContentInRow(index) {
  return rows[index].columns.some((column) => column.content.length > 0);
}

function addRowWithContent(content) {
  addRow();
  rows.value[rows.value.length - 1] = content;
  selectRow(rows.value.length - 1);
}

function handleDragStart(type, color = null) {
  dragItemType.value = type;
  colorDraggedBtn.value = colorDraggedBtn;
}

function handleConfigureColumns(numColumns, proportions = []) {
  if (selectedRowIndex.value === null) return;

  const currentColumns = rows[selectedRowIndex.value].columns;
  const updatedColumns = configureColumns(numColumns, proportions, currentColumns);

  rows[selectedRowIndex.value].columns = updatedColumns;

  if (activeColumn.value >= numColumns) {
    activeColumn.value = numColumns - 1;
  }

  saveHistory();
}

function updateColumnBackgroundColor(newColor) {
  if (selectedRowIndex.value !== null && activeColumn.value !== null) {
    columnBackgroundColor.value = newColor;
    rows[selectedRowIndex.value].columns[activeColumn.value].backgroundColor = newColor;
    saveHistory();
  }
}

function updateColumnPadding({ side, value }) {
  if (selectedRowIndex.value !== null && activeColumn.value !== null) {
    rows[selectedRowIndex.value].columns[activeColumn.value].padding[side] = value;
    saveHistory();
  }
}

function updateColumnBorderWidth({ side, value }) {
  if (selectedRowIndex.value !== null && activeColumn.value !== null) {
    rows[selectedRowIndex.value].columns[activeColumn.value].border.width[side] = value;
    saveHistory();
  }
}

function updateColumnBorderColor({ side, value }) {
  if (selectedRowIndex.value !== null && activeColumn.value !== null) {
    rows[selectedRowIndex.value].columns[activeColumn.value].border.color[side] = value;
    saveHistory();
  }
}

function updateRowBackgroundColor(newColor) {
  if (selectedRowIndex.value !== null) {
    rows[selectedRowIndex.value].bgColor = newColor;
    saveHistory();
  }
}

function updateRowPadding({ side, value }) {
  if (selectedRowIndex.value !== null) {
    rows[selectedRowIndex.value].padding[side] = value;
    saveHistory();
  }
}

function updateTextLineHeight(lh) {
  if (selectedBlock.value && selectedBlock.value.type === 'text') {
    selectedBlock.value.properties.lineHeight = lh;
    saveHistory();
  }
}

function selectRow(index, event) {
  const clickedElement = event?.target.closest('.block-wrapper');
  if (clickedElement) return;
  rows.forEach((row, i) => {
    row.isSelected = i === index;
  });
  selectedBlockRowIndex.value = null;
  selectedBlock.value = null;
  selectedBlockId.value = null;
  selectedRowIndex.value = index;
  selectColumn(0);
}

function selectColumn(index) {
  activeColumn.value = index;
  columnBackgroundColor.value = rows[selectedRowIndex.value]?.columns[activeColumn.value].backgroundColor;
}
function upRow(index) {
  const newRows = moveItem(rows, index, index - 1);
  rows.splice(0, rows.length, ...newRows);
  selectRow(index - 1);
}

function downRow(index) {
  const newRows = moveItem(rows, index, index + 1);
  rows.splice(0, rows.length, ...newRows);
  selectRow(index + 1);
}

function addRow() {
  rows.push({
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
  selectRow(rows.length - 1);
  saveHistory();
}

function clearCanvas() {
  rows.splice(0, rows.length, {
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
  });
  selectedRowIndex.value = null;
  activeColumn.value = null;
  selectedBlock.value = null;
  selectRow(0);
}

function handleDeleteRow(rowIndex) {
  const updatedRows = deleteRowAtIndex(rows, rowIndex);

  if (updatedRows !== rows) {
    const newRowIndex = rowIndex - 1 >= 0 ? rowIndex - 1 : null;
    activeColumn.value = null;

    rows.splice(0, rows.length, ...updatedRows);

    selectRow(rowIndex === 0 ? rowIndex : rowIndex - 1);
    saveHistory();
  }
}

function handleDuplicateRow(rowIndex) {
  const duplicated = duplicateRowAtIndex(rows, rowIndex);
  rows.splice(0, rows.length, ...duplicated);
  saveHistory();
}

function saveHistory() {
  saveHistoryState(history, rows);
}

function undo() {
  const previous = undoState(history);
  if (previous) {
    rows.splice(0, rows.length, ...previous);
    selectedBlock.value = null;
    selectedBlockId.value = null;
  }
}

function redo() {
  const next = redoState(history);
  if (next) {
    rows.splice(0, rows.length, ...next);
    selectedBlock.value = null;
    selectedBlockId.value = null;
  }
}
function exportMJMLToHTML() {
  const mjml = generateMJML(rows);
  const { html } = mjml2html(mjml, { beautify: true, minify: false });
  const processedHTML = postProcessHTML(html);
  return processedHTML;
}

function showPreview() {
  htmlForPreview.value = exportMJMLToHTML();
  showPreviewContent.value = true;
}

function closePreview() {
  htmlForPreview.value = '';
  showPreviewContent.value = false;
}

function openModalConfirm(actionFn) {
  modalConfirm.action = actionFn;
  modalConfirm.shown = true;
}

function handleModalConfirmAction() {
  modalConfirm.action();
  modalConfirm.close();
}
function openModalEditText(block) {
  modalEditText.originalText = block.properties?.text;
  modalEditText.backgroundColor = rows[selectedBlockRowIndex.value].columns[selectedColumnIndex.value].backgroundColor;
  modalEditText.newText = block.properties?.text || '';
  modalEditText.shown = true;
  editingText.value = true;
}

function updateNewText(newText) {
  modalEditText.newText = newText;
}

function updateTextBlockContent() {
  const newContent = modalEditText.newText;

  const adjustedContent = newContent.replace(/<p(\s+[^>]*)?>/g, (match, attrs) => {
    if (attrs?.includes('style=')) {
      return match.replace(/style="([^"]*)"/, (styleMatch, styleContent) => {
        const hasTextAlign = /text-align\s*:\s*[^;]+/.test(styleContent);
        const updatedStyle = `${styleContent}; margin: 0;${hasTextAlign ? '' : ' text-align: left;'}`;
        return `style="${updatedStyle.trim()}"`;
      });
    } else {
      return `<p style="margin: 0; text-align: left;"${attrs || ''}>`;
    }
  });

  const adjustedWithFigureStyles = adjustedContent.replace(
    /<figure([^>]*)style="([^"]*)"[^>]*>\s*<img([^>]*)style="([^"]*)"/g,
    (match, figureAttrs, figureStyle, imgAttrs, imgStyle) => {
      let updatedStyle = imgStyle;
      const figureWidthMatch = figureStyle.match(/width\s*:\s*([^;]+);?/);
      const figureWidth = figureWidthMatch ? figureWidthMatch[1].trim() : null;

      if (figureWidth && !/width\s*:\s*[^;]+;/.test(imgStyle)) {
        updatedStyle += ` width: ${figureWidth};`;
      }
      if (!/height\s*:\s*auto;/.test(updatedStyle)) {
        updatedStyle += ' height: auto;';
      }
      return `<figure${figureAttrs} style="${figureStyle}"><img${imgAttrs}style="${updatedStyle}"`;
    }
  );

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
          return `<img${attrsBeforeStyle}style="${updatedStyle}"${attrsWithoutHeight.replace(/width="[^"]*"/, `width="${styleWidthValue}"`)}>`;
        } else {
          return `<img${attrsBeforeStyle}style="${updatedStyle}" width="${styleWidthValue}"${attrsWithoutHeight}>`;
        }
      }

      return `<img${attrsBeforeStyle}style="${updatedStyle}"${attrsWithoutHeight}>`;
    }
  );

  if (selectedBlock.value) {
    selectedBlock.value.properties.text = adjustedWithImageStyles;
    saveHistory();
  }

  modalEditText.close();
}

function getColumnFromBlockId(blockId) {
  for (const row of rows) {
    for (const column of row.columns) {
      if (column.content.some((block) => block.blockId === blockId)) {
        return column;
      }
    }
  }
  return null;
}

function handleBlockSelection(blockId) {
  for (let rowIndex = 0; rowIndex < rows.length; rowIndex++) {
    const row = rows[rowIndex];
    for (let columnIndex = 0; columnIndex < row.columns.length; columnIndex++) {
      const column = row.columns[columnIndex];
      const block = column.content.find((block) => block.blockId === blockId);

      if (block) {
        const isText = blockId.includes('text');
        const isButton = blockId.includes('button');

        selectedRowIndex.value = null;
        selectedBlockRowIndex.value = rowIndex;
        selectedColumnIndex.value = columnIndex;
        selectedBlockId.value = blockId;
        selectedBlock.value = block;

        rows.forEach((r) => (r.isSelected = false));
        activeColumn.value = null;

        if (isButton) {
          buttonText.value = block.properties.text;
          buttonLink.value = block.properties.href;
        }

        return;
      }
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
