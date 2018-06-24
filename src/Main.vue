<template>
  <div>
    <router-view class="main-router-view"></router-view>
  </div>
</template>

<style lang="scss">
  body {
    background: white !important;
  }
  .md-theme-default.md-button:not([disabled]).md-raised:not(.md-icon-button):not(.md-accent) {
    background: white;
  }
  .md-theme-default.md-button:not([disabled]).md-fab.md-clean {
    background: white;
  }
  .md-theme-default.md-sidenav .md-sidenav-content {
    background: white;
  }
  .md-theme-default.md-dialog-container .md-dialog {
    background: white;
  }

  .main-router-view {
    min-height: 100vh;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }
  .md-button.focusfix:focus {
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
  }
</style>
