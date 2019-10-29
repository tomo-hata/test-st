<template>
  <button
      class="c-button"
      :class="[
          variation ? 'c-button--' + variation : '',
          size ? 'c-button--' + size : '',
          {
    　　　　　　　　'c-button--outline': outline,
            'c-button--round': round,
            'c-button--full': full,
            'c-button--text': text,
            'is-disabled': disabled,
            'is-loading': loading,
          }]"
    
      :disabled="disabled"
      :type="buttonType"
      :autofocus="autofocus"
    
      @click="clickHandler"
  >
    <i
        :class="[
          'fa',
          'fa-' + icon,
        ]"
        v-if="icon"
    >
    </i>
    <slot></slot>
  </button>
</template>

<script>
  export default {

    props: {
      variation: {
        type: String,
        default: ''
      },
      size: String,
      icon: {
        type: String,
        default: ''
      },
      buttonType: {
        type: String,
        default: 'button'
      },
      outline: Boolean,
      round: Boolean,
      full: Boolean,
      text: Boolean,
      loading: Boolean,
      disabled: Boolean,
      autofocus: Boolean,
    },

    methods: {

      /**
       * 親にクリックイベントを渡す
       * @param e {Object} event object
       */
      clickHandler: function(e) {

        if (this.disabled) {

          return;

        }
        this.$emit('click', e);

      }

    }
  };

</script>