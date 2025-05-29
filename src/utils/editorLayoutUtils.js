/**
 * Returns the appropriate class name for a given column layout.
 * @param {number} numColumns - The number of columns.
 * @param {number} [firstColumnWidth] - The width of the first column, if applicable.
 * @returns {string}
 */
export function getColumnClass(numColumns, firstColumnWidth) {
  if (numColumns === 1) {
    return 'single-column';
  } else if (numColumns === 2) {
    if (firstColumnWidth === 67) {
      return 'two-columns two-columns-67-33';
    } else if (firstColumnWidth === 33) {
      return 'two-columns two-columns-33-67';
    } else {
      return 'two-columns';
    }
  } else if (numColumns === 3) {
    return 'three-columns';
  } else if (numColumns === 4) {
    return 'four-columns';
  }
  return '';
}

/**
 * Generates a new set of columns based on the number and proportions.
 * @param {number} numColumns - Number of columns to create.
 * @param {number[]} proportions - Optional array of column width proportions.
 * @param {Array} currentColumns - Existing columns to preserve config when possible.
 * @returns {Array} - New columns configuration array.
 */
export function configureColumns(numColumns, proportions = [], currentColumns = []) {
  return Array.from({ length: numColumns }, (_, i) => {
    const existing = currentColumns[i];
    const width = proportions[i] || 100 / numColumns;

    return existing
      ? {
          ...existing,
          width,
        }
      : {
          content: [],
          backgroundColor: '#ffffff',
          padding: { top: 0, right: 0, bottom: 0, left: 0 },
          border: {
            width: { top: 0, right: 0, bottom: 0, left: 0 },
            color: { top: '#000', right: '#000', bottom: '#000', left: '#000' },
          },
          width,
        };
  });
}
