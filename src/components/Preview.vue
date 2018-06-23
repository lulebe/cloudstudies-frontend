<template>
  <div class="preview-container" v-if="opened">
    <md-toolbar>
      <md-button class="md-icon-button" @click.native="close">
        <md-icon>close</md-icon>
      </md-button>
      <h1 class="md-title">Preview: {{file.name}}</h1>
    </md-toolbar>
    <div v-if="!hasPreview" class="info-no-preview">
      There is no preview for this file.
    </div>
  </div>
</template>
<script>
export default {
  data () {
    return {
      file: null,
      opened: false
    }
  },
  computed: {
    hasPreview() {return this.file.previewFileCount && this.file.previewFileCount > 0}
  },
  methods: {
    open (file) {
      this.file = file
      this.opened = true
    },
    close () {
      this.opened = false
      this.file = null
    }
  }
}
</script>
<style lang="scss" scoped>
  .preview-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    background: rgba(0,0,0,0.8);
  }
  .info-no-preview {
    width: 100%;
    text-align: center;
    padding-top: 100px;
  }
</style>
