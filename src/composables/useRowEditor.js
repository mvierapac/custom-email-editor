import { duplicateRowAtIndex, deleteRowAtIndex } from '_utils/editorArrayUtils.js';
import { saveHistoryState } from '_utils/historyManager.js';

export function useRowEditor(rows, selectedRowIndex, activeColumn, selectRow) {
  const addRow = () => {
    const newRow = {
      columns: [
        {
          content: [],
          backgroundColor: '#ffffff',
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          border: {
            width: { top: 0, right: 0, bottom: 0, left: 0 },
            color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
          },
          width: 100,
        },
      ],
      bgColor: '#ffffff',
      padding: { top: 0, right: 0, bottom: 0, left: 0 },
      isSelected: false,
    };

    rows.push(newRow);
    selectedRowIndex.value = rows.length - 1;
    activeColumn.value = null;
    saveHistoryState(rows);
  };

  const upRow = (index) => {
    if (index > 0) {
      const temp = rows[index - 1];
      rows[index - 1] = rows[index];
      rows[index] = temp;
      selectedRowIndex.value = index - 1;
      activeColumn.value = null;
      saveHistoryState(rows);
    }
  };

  const downRow = (index) => {
    if (index < rows.length - 1) {
      const temp = rows[index + 1];
      rows[index + 1] = rows[index];
      rows[index] = temp;
      selectedRowIndex.value = index + 1;
      activeColumn.value = null;
      saveHistoryState(rows);
    }
  };

  const handleDeleteRow = (rowIndex) => {
    if (rows.length === 1) return;

    const updated = deleteRowAtIndex(rows, rowIndex);
    rows.splice(0, rows.length, ...updated);

    const newIndex = rowIndex === 0 ? 0 : rowIndex - 1;
    selectedRowIndex.value = newIndex;
    activeColumn.value = null;
    selectRow(newIndex);
    saveHistoryState(rows);
  };

  const handleDuplicateRow = (rowIndex) => {
    const cloned = duplicateRowAtIndex(rows, rowIndex);
    rows.splice(rowIndex + 1, 0, cloned);
    selectedRowIndex.value = rowIndex + 1;
    activeColumn.value = null;
    saveHistoryState(rows);
  };

  const emptyRowSelected = () => {
    const row = rows[selectedRowIndex.value];
    return row && row.columns.every((col) => col.content.length === 0);
  };

  return {
    addRow,
    upRow,
    downRow,
    handleDeleteRow,
    handleDuplicateRow,
    emptyRowSelected,
  };
}
