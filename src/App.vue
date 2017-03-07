<template>
  <div id="app">
    <div class="main-container">
      <md-toolbar>
        <md-button class="md-icon-button drawer-open-btn" @click.native="toggleLeftSidenav">
          <md-icon>menu</md-icon>
        </md-button>
        <h1 class="md-title" style="flex: 1">Cloud Studies</h1>
      </md-toolbar>
    </div>
    <md-sidenav class="md-left drawer" ref="leftSidenav">
      <md-toolbar></md-toolbar>
    </md-sidenav>
  </div>
</template>

<script>
export default {
  name: 'app',
  data () {
    return {

    }
  },
  methods: {
    toggleLeftSidenav () {
      this.$refs.leftSidenav.toggle()
    }
  }
}
</script>

<style lang="scss">
  @media (min-width: 1025px) {
    .main-container {
      padding-left: 280px;
    }
    .drawer-open-btn {
      visibility: hidden;
    }
    .drawer.md-left .md-sidenav-content {
      transform: translateX(0);
      box-shadow: -3px 0 5px 5px rgba(0,0,0,0.2);
    }
  }
  .md-raised.md-focusfix:focus {
    box-shadow: 0 5px 12px 0px rgba(0,0,0,0.5);
    transform: scale(1.02);
  }
</style>
