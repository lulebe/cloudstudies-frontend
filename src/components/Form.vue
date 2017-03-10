<template lang="html">
  <fieldset>
    <legend>{{title}}</legend>
    <form v-on:submit.prevent="submit" autocomplete="off">
      <slot />
      <md-button class="md-accent md-raised md-focusfix" type="submit">{{submitBtnText}}</md-button>
    </form>
  </fieldset>
</template>

<script>
export default {
  props: [
    'title',
    'submitBtnText'
  ],
  methods: {
    submit () {
      this.$emit('submit')
    }
  }
}
</script>

<style lang="scss" scoped>
  fieldset {
    margin: 24px auto 0 auto;
    max-width: 400px;
    border: 1px solid #aaa;
    legend {
      color: #444;
      font-size: 1rem;
    }
  }
</style>
