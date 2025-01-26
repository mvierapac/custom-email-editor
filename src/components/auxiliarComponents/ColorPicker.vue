<template>
  <v-menu
    :close-on-content-click="false"
    offset-y
  >
    <!-- Activador: el div que abre el menú -->
    <template #activator="{ props }">
      <div
        class="color-preview"
        v-bind="props"
        :style="{ backgroundColor: inputValue, cursor: 'pointer', border: '1px solid #ccc' }"
        >
      </div>
    </template>
    <v-color-picker
      v-model="inputValue"
      mode="hex"
      hide-canvas
      show-swatches
      swatches-max-height="400px"

    />
  </v-menu>
</template>

<script>

export default {
  name: 'ColorPicker',
  components: {
  },
  props: {
    showPicker: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [String],
      default: String
    }
  },
  data () {
    return {
    }
  },
  computed: {
    inputValue: {
      get() {
        return this.modelValue
      },
      set(val) {
        this.$emit('update:modelValue', val)
      }
    },
  },
  methods: {
  }
}
</script>

<style scoped lang="scss">

.color-preview {
    width: 28px;
    height: 28px;
    border-radius: 4px;
    border: 1px solid #ddd;
    cursor: pointer;
  }

.v-color-picker :deep(.v-color-picker-preview__sliders) {
  display: none;
}
</style>
