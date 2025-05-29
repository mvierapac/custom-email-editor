export function useImageBlockEditor(selectedBlock, saveHistory) {
  function updateImageHref(newHref) {
    if (selectedBlock.value && selectedBlock.value.type === 'image') {
      selectedBlock.value.properties.href = newHref;
      saveHistory();
    }
  }

  function updateImageWidth(newWidth) {
    if (selectedBlock.value && selectedBlock.value.type === 'image') {
      selectedBlock.value.properties.width = newWidth;
      saveHistory();
    }
  }

  function updateImageSrc(newSrc) {
    if (selectedBlock.value && selectedBlock.value.type === 'image') {
      selectedBlock.value.properties.src = newSrc;
      saveHistory();
    }
  }

  return {
    updateImageHref,
    updateImageWidth,
    updateImageSrc,
  };
}
