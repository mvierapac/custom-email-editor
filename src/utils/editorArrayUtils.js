export function moveItem(array, fromIndex, toIndex) {
  if (fromIndex < 0 || toIndex < 0 || fromIndex >= array.length || toIndex >= array.length) return array;

  const newArray = [...array];
  const [item] = newArray.splice(fromIndex, 1);
  newArray.splice(toIndex, 0, item);
  return newArray;
}

export function deleteBlockFromContent(content, blockId) {
  return content.filter((block) => block.blockId !== blockId);
}

export function duplicateBlockInContent(content, blockId) {
  const index = content.findIndex((block) => block.blockId === blockId);
  if (index === -1) return content;

  const blockToDuplicate = content[index];
  const newBlock = JSON.parse(JSON.stringify(blockToDuplicate));
  newBlock.blockId = `${newBlock.type}-${Date.now()}`;

  const newContent = [...content];
  newContent.splice(index + 1, 0, newBlock);
  return newContent;
}

export function deleteRowAtIndex(rows, index) {
  if (rows.length <= 1) return rows;
  const newRows = [...rows];
  newRows.splice(index, 1);
  return newRows;
}

export function duplicateRowAtIndex(rows, index) {
  const originalRow = rows[index];
  const clonedRow = JSON.parse(JSON.stringify(originalRow));

  clonedRow.columns = clonedRow.columns.map((column) => ({
    ...column,
    content: column.content.map((block) => {
      const prefix = block.blockId.split('-')[0];
      const newBlockId = `${prefix}-${Date.now()}-${Math.floor(Math.random() * 1000)}`;
      return {
        ...block,
        blockId: newBlockId,
      };
    }),
  }));

  const newRows = [...rows];
  newRows.splice(index + 1, 0, clonedRow);
  return newRows;
}
