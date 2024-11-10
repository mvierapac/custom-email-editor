<template>
    <div class="properties-panel">

      <!-- input type file -->
       <div :style="{'margin-bottom':'12px'}">
        <label for="attachImg">
          <span class="upload-img-button">Subir imagen</span>
        </label>
        <input type="file" value="" @change="uploadImg()"
          id="attachImg" name="attachImg"
        >
       </div>
      <div class="input-container">
        <label for="url-input">URL</label>
        <input
          type="text"
          id="url-input"
          v-model="localImageLink"
          @blur="updateHref"
          placeholder="https://example.com">
      </div>

          <!-- Control  para el ancho de la imagen -->
      <div class="property-wrapper">
        <p class="property-title">Ancho de la imagen</p>
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
      
      <!-- Review Botones de alineación con iconos correspondientes -->
      <!-- Alineación de la imagen -->
      <div class="property-wrapper">
        <p class="property-title">Alineación</p>
        <div class="align-buttons">
          <button class="align-button" @click="updateAlignment('left')">Izda</button>
          <button class="align-button" @click="updateAlignment('center')">Centro</button>
          <button class="align-button" @click="updateAlignment('right')">Drcha</button>
        </div>
      </div> 
      <!-- Padding control -->
      <div class="property-wrapper">
          <p class="property-title">Padding del contenedor</p>
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
      }
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

      // Review: Implementar back y limitar tipos de archivos
      uploadImg () {
        // get file selected by user
        const file = document.getElementById('attachImg').files[0]
        const type = file.type
        this.attachImgs = file
        console.log(this.attachImgs)
        const input = document.getElementById('attachImg')
        input.value = null
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
  
  <style scoped>
  .properties-panel {
    display: flex;
    flex-direction: column;
    gap: 8px;
  }

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

  </style>
  