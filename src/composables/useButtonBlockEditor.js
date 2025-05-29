export function useButtonBlockEditor(selectedBlock, saveHistory) {
  function updateButtonText(newText) {
    if (selectedBlock.value && selectedBlock.value.type === 'button') {
      selectedBlock.value.properties.text = newText;
      saveHistory();
    }
  }

  function updateButtonHref(newHref) {
    if (selectedBlock.value && selectedBlock.value.type === 'button') {
      selectedBlock.value.properties.href = newHref;
      saveHistory();
    }
  }

  return {
    updateButtonText,
    updateButtonHref,
  };
}
