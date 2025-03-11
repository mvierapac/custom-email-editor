<template>
  <div>
    <div class="overlay"></div>
    <div ref="dialog" class="custom-dialog">
      <div>
        <!-- Slot para contenido dinámico -->
        <slot></slot>
      </div>
      <div class="buttons">
        <button class="btn-basic" @click="emitConfirm()">{{ $t('COMMON.CONFIRM') }}</button>
        <button class="btn-link" @click="emitClose()">{{ $t('COMMON.CANCEL') }}</button>
      </div>
    </div>
  </div>
</template>

<script>
/**
 * Made it this way because ckeditor link does not work propperly on v-dialog or native html dialog
 */
export default {
  name: 'EditTextDialog',
  methods: {
    emitConfirm() {
      this.$emit('confirm');
    },
    emitClose() {
      this.$emit('close');
    },
  },
};
</script>

<style scoped>
.overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  transition: 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  transition-property: opacity;
  will-change: opacity;
  z-index: 999;
}
.custom-dialog {
  width: 60vw;
  border: none;
  background-color: #ffffff;
  border-radius: 8px;
  padding: 34px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  position: fixed;
  top: 35%;
  left: 50%;
  transform: translate(-50%, -50%);
  z-index: 5000;
}

.custom-dialog {
  animation: fadeIn 0.2s ease-in-out;
}

.buttons {
  display: flex;
  justify-content: center;
  gap: 24px;
  margin: 40px;
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
</style>
