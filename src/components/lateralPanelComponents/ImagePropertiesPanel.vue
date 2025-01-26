<template>
    <div class="properties-panel lateral-panel-section-padding sticky-panel">
      <p class="properties-title">{{ $t('EDITOR.IMAGE_PROPERTIES') }}</p>
      <!-- input type file -->
       <div :style="{'margin-bottom':'12px'}">
        <label for="attachImg">
          <span class="upload-img-button">{{ $t('EDITOR.UPLOAD_IMAGE') }}</span>
        </label>
        <input type="file" ref="fileInput" value="" @change="uploadImg()"
          id="attachImg" name="attachImg"
        >
       </div>
      <div class="input-container">
        <label for="url-input">{{ $t('EDITOR.URL') }}</label>
        <input
          type="text"
          id="url-input"
          v-model="localImageLink"
          @blur="updateHref"
          placeholder="https://example.com">
      </div>

          <!-- Control  para el ancho de la imagen -->
      <div class="property-wrapper">
        <p class="property-title">{{ $t('EDITOR.IMAGE_WIDTH') }}</p>
        <div class="input-range-wrapper">
          <input
            type="range"
            id="width-slider"
            v-model="localImageWidth"
            @input="updateImageWidth"
            min=10
            max=100
          />
          <span>{{ localImageWidth }}%</span>
        </div>
      </div>
      
      <!-- Alineación de la imagen -->
      <div class="property-wrapper">
        <p class="property-title">{{ $t('EDITOR.ALIGNMENT') }}</p>
        <div class="align-buttons">
          <button
           class="align-button" 
           :class="{ 'align-button--selected': isSelectedAlignment('left') }" 
           @click="updateAlignment('left')"
          >
            <v-icon>mdi-format-align-left</v-icon>
          </button>
          <button 
            class="align-button" 
            :class="{ 'align-button--selected': isSelectedAlignment('center') }" 
            @click="updateAlignment('center')"
          >
            <v-icon>mdi-format-align-center</v-icon>
          </button>
          <button 
            class="align-button" 
            :class="{ 'align-button--selected': isSelectedAlignment('right') }" 
            @click="updateAlignment('right')"
          >
            <v-icon>mdi-format-align-right</v-icon>
          </button>
        </div>
      </div> 
      <!-- Padding control -->
      <div class="property-wrapper">
          <p class="property-title">{{ $t('EDITOR.CONTAINER_PADDING') }}</p>
          <div class="padding-controls">
            <div class="padding-control" v-for="side in ['Top', 'Right', 'Bottom', 'Left']" :key="side">
                <label>{{ side }}</label>
                <div class="control-wrapper">
                    <input type="number" v-model="containerPadding[side.toLowerCase()]" @input="updateLocalPadding(side)" min="0" class="padding-input" />
                    <span class="unit">px</span>
                    <button @click="decreaseLocalPadding(side)" class="adjust-button">−</button>
                    <button @click="increaseLocalPadding(side)" class="adjust-button">+</button>
                </div>
            </div>
          </div>
       </div>      
    </div>
  </template>
  
  <script>

  export default {
    props: {
      imageLink: {
        type: String,
        required: true
      },
      imageWidth: {
        type: Number,
        default: 100,
      },
      containerPadding: {
        type: Object,
        required: true
      },
      alignment: {
        type: String,
        required: true
      },
    },
    data() {
      return {
        localImageLink: this.imageLink,
        localContainerPadding: { ...this.containerPadding },
        localImageWidth: this.imageWidth,
        attachImgs: null,
      };
    },
    methods: {
      isSelectedAlignment (align) {
        return this.alignment === align
      },
      updateSrc (src) {
        this.$emit('update-img-src', src);
      },
      updateHref() {
        this.$emit('update-img-href', this.localImageLink);
      },
      updateImageWidth() {
        this.$emit('update-img-width', Number(this.localImageWidth));
      },
      updateAlignment(alignment) {
        this.$emit('update-block-alignment', alignment);
      },
      increaseLocalPadding (side) {
        this.localContainerPadding[side.toLowerCase()]++
        this.updateLocalContainerPadding(side);
      },
      decreaseLocalPadding (side) {
        if (this.localContainerPadding[side.toLowerCase()] > 0) {
          this.localContainerPadding[side.toLowerCase()]--
          this.updateLocalContainerPadding(side);
        }
      },
      updateLocalContainerPadding(side) {
        // Emitimos el evento con el padding actualizado para el lado especificado
        this.$emit('update-container-padding', { side: side.toLowerCase(), value: this.localContainerPadding[side.toLowerCase()] });
      },

      triggerFileInput() {
        // Método para activar el input desde el padre
        this.$refs.fileInput.click();
      },
    },
    watch: {
      imageLink(newLink) {
        this.localImageLink = newLink;
      },
      imageWidth(newWidth) {
        this.localImageWidth = newWidth;
      },
      containerPadding(newPadding) {
        this.localContainerPadding = { ...newPadding };
      },
    }
  };
  </script>
  
  <style scoped lang='scss'>
  input[type="file"] {
    display: none;
 }

 .upload-img-button {
  border-radius: 8px;
  border: 1px solid transparent;
  background-color: #f0f0f0;
  padding: 8px 16px;
  font-size: 14px;
  font-weight: 500;
  font-family: inherit;
  cursor: pointer;
  transition: border-color 0.25s;
}
.upload-img-button:hover {
  border-color: #48424200;
}

.input-range-wrapper {
  display: grid;
  grid-template-columns: 1fr auto;
  gap: 8px;
}

.align-buttons {
    margin-top: 8px;
    display: flex;
    gap: 4px;
  }

.align-button {
  background-color: #ffff;
  border: 1px solid #D3D3D3;
  border-radius: 2px;
  padding: 0.6em 1.2em;
  font-size: 12px;
  transition: background-color 0.2s ease;
  cursor: pointer;

  &:hover {
    background-color: #D3D3D3;
  }

  &--selected {
    background-color: #D3D3D3;
  }
}
  </style>
  