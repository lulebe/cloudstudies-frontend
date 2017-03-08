<template lang="html">
  <md-toolbar>
    <md-button class="md-icon-button drawer-open-btn" @click.native="toggleLeftSidenav">
      <md-icon>menu</md-icon>
    </md-button>
    <h1 class="md-title toolbar-title">{{title}}</h1>
  </md-toolbar>
</template>

<script>
  export default {
    props: [
      'title'
    ],
    methods: {
      toggleLeftSidenav () {
        this.$store.commit('openDrawer')
      }
    }
  }
</script>

<style lang="scss">
  @media (min-width: 1025px) {
    .drawer-open-btn {
      display: none;
    }
    .md-toolbar .md-title.toolbar-title {
      margin-left: 8px;
    }
  }
</style>
