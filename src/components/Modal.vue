<script setup>
import { computed } from 'vue';
import { useSlots, defineProps, defineEmits } from 'vue';

const props = defineProps({
  shownModal: Boolean,
  title: String,
  subtitle: String,
  textButton: String,
  textLink: String,
  btnDisabled: Boolean,
  bigger: {
    type: Boolean,
    default: false,
  },
  iconType: Number,
  actionButtonStyle: {
    type: Number,
    default: 0,
  },
});

const emit = defineEmits(['eventButtonModal', 'eventLinkModal']);

const show = computed(() => props.shownModal);

function getIcon() {
  switch (props.iconType) {
    case 1:
      return new URL('/src/assets/images/caution.png', import.meta.url).href;
    case 2:
      return new URL('/src/assets/images/error.svg', import.meta.url).href;
    case 3:
      return new URL('/src/assets/images/success.svg', import.meta.url).href;
    default:
      return '';
  }
}

function clickButton() {
  emit('eventButtonModal');
}

function clickLink() {
  emit('eventLinkModal');
}

function getClass() {
  return props.actionButtonStyle === 1 ? 'center-button' : '';
}
</script>

<template>
  <div>
    <v-dialog v-model="show" persistent content-class="common-modal">
      <div class="modal">
        <div class="modal__img" v-if="iconType">
          <img :src="getIcon()" width="120" height="120" />
        </div>
        <div class="modal__title" v-if="title">
          {{ title }}
        </div>
        <div class="modal__subtitle" v-if="subtitle">
          {{ subtitle }}
        </div>
        <slot></slot>
        <div class="modal__box-actions" :class="getClass()">
          <button
            class="btn-basic"
            :class="{ 'btn-basic--disabled': btnDisabled }"
            @click="clickButton()"
            v-if="textButton"
          >
            {{ textButton }}
          </button>
          <button class="link-btn" @click="clickLink()" v-if="textLink">{{ textLink }}</button>
        </div>
      </div>
    </v-dialog>
  </div>
</template>

<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.modal {
  &__title {
    text-align: center;
    color: $grey-600;
    font-size: 24px;
    font-family: 'BentonSansBBVABook';
    margin-bottom: 16px;
    line-height: 2rem;
  }
  &__subtitle {
    text-align: center;
    color: $grey-600;
    font-size: 18px;
    font-family: 'BentonSansBBVABook';
    margin-bottom: 16px;
  }
  &__img {
    text-align: center;
  }
  &__box-actions {
    margin-top: 40px;
    text-align: center;
    .link-btn {
      color: $medium-blue;
      font-size: 15px;
      font-family: 'BentonSansBBVA';
      cursor: pointer;
      margin-left: 32px;
      &:hover {
        color: $core-blue;
      }
    }
  }
}
.center-button {
  text-align: center;
}
</style>
