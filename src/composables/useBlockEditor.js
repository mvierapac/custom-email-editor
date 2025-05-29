import { moveItem } from '_utils/editorArrayUtils';

export function useBlockEditor({
  selectedBlock,
  selectedBlockRowIndex,
  selectedColumnIndex,
  rows,
  saveHistory,
  getColumnFromBlockId,
}) {
  function handleDeleteBlock(blockId) {
    const column = getColumnFromBlockId(blockId);
    if (column) {
      column.content = column.content.filter((block) => block.blockId !== blockId);
      saveHistory();
    }
  }

  function handleDuplicateBlock(blockId) {
    const column = getColumnFromBlockId(blockId);
    if (column) {
      const blockToDuplicate = column.content.find((block) => block.blockId === blockId);
      if (blockToDuplicate) {
        const newBlock = JSON.parse(JSON.stringify(blockToDuplicate));
        newBlock.blockId = `${newBlock.type}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
        const index = column.content.findIndex((block) => block.blockId === blockId);
        column.content.splice(index + 1, 0, newBlock);
        saveHistory();
      }
    }
  }

  function updateContainerPadding({ side, value }) {
    if (selectedBlock.value) {
      selectedBlock.value.properties.containerPadding[side] = value;
      saveHistory();
    }
  }

  function updateBlockAligment(alignment) {
    if (selectedBlock.value) {
      selectedBlock.value.properties.alignment = alignment;
      saveHistory();
    }
  }

  function upBlock(index) {
    const content = rows[selectedBlockRowIndex.value].columns[selectedColumnIndex.value].content;
    if (!content) return;

    const newContent = moveItem(content, index, index - 1);
    rows[selectedBlockRowIndex.value].columns[selectedColumnIndex.value].content = newContent;
    saveHistory();
  }

  function downBlock(index) {
    const content = rows[selectedBlockRowIndex.value].columns[selectedColumnIndex.value].content;
    if (!content) return;

    const newContent = moveItem(content, index, index + 1);
    rows[selectedBlockRowIndex.value].columns[selectedColumnIndex.value].content = newContent;
    saveHistory();
  }

  return {
    handleDeleteBlock,
    handleDuplicateBlock,
    updateContainerPadding,
    updateBlockAligment,
    upBlock,
    downBlock,
  };
}
