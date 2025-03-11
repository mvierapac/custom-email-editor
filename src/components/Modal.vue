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

<script>
/*
  IconType: {
    1: Caution
    2: Error
    3: Success
  }

  // Use slot on parent component to customize modal
*/
export default {
  name: 'modal-common',
  props: {
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
    iconType: {
      type: Number,
    },
    actionButtonStyle: {
      type: Number,
      default: 0,
    },
  },
  data() {
    return {};
  },
  computed: {
    show() {
      return this.shownModal;
    },
  },
  methods: {
    getIcon() {
      switch (this.iconType) {
        case 1:
          return new URL('/src/assets/images/caution.png', import.meta.url).href;
        case 2:
          return new URL('/src/assets/images/error.svg', import.meta.url).href;
        case 3:
          return new URL('/src/assets/images/success.svg', import.meta.url).href;
        default:
          break;
      }
    },
    clickButton() {
      this.$emit('eventButtonModal');
    },
    clickLink() {
      this.$emit('eventLinkModal');
    },
    getClass() {
      if (this.actionButtonStyle === 1) {
        return 'center-button';
      }
    },
  },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
@import '@/assets/scss/_variables.scss';

.modal {
  // @include until-600{
  //     text-align: center;
  // }
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
      // @include until-600{
      //     margin-top: 16px;
      //     margin-left: 0;
      //     display: block;
      // }
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
