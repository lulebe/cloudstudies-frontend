<template lang="html">
    <div class="main-container">
      <app-toolbar title="Store"></app-toolbar>
      <app-folder></app-folder>
      <md-speed-dial class="md-fab-bottom-right">
        <md-button class="md-fab" md-fab-trigger>
          <md-icon md-icon-morph>close</md-icon>
          <md-icon>add</md-icon>
        </md-button>
        <md-button class="md-fab md-primary md-mini md-clean">
          <md-icon>create_new_folder</md-icon>
        </md-button>
        <md-button class="md-fab md-primary md-mini md-clean">
          <md-icon>cloud_upload</md-icon>
        </md-button>
      </md-speed-dial>
    </div>
</template>

<script>
  export default {
    props: [
      'storeid'
    ],
    data () {
      return {
        fileview: 0
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fab {
    position: absolute;
    right: 16px;
    bottom: 16px;
  }
</style>
