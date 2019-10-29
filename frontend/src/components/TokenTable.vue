<template>
  <div class="token-table">
    <b-table striped hover :items="items" :fields="fields" />
  </div>
</template>

<script>
export default {
  name: 'TokenTable',
  props: {
    items: {
      type: Array,
      required: true
    },
    fields: {
      type: Array,
      required: true
    }
  }
}
</script>