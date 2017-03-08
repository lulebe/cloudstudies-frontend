<template lang="html">
  <md-toolbar>
    <md-button class="md-icon-button drawer-open-btn" @click.native="toggleLeftSidenav">
      <md-icon>menu</md-icon>
    </md-button>
    <h1 class="md-title toolbar-title" style="flex: 1;" v-show="!searchVisible">{{title}}</h1>
    <form v-on:submit.prevent="search">
      <md-input-container class="search-input" v-bind:class="{shown: searchVisible}" md-inline>
        <label>Search</label>
        <md-input v-model="searchInput"></md-input>
      </md-input-container>
    </form>
    <md-button class="md-icon-button btn-search-close" v-show="searchVisible" @click.native="searchVisible = false">
      <md-icon>close</md-icon>
    </md-button>
    <md-button class="md-icon-button" v-show="!searchVisible" @click.native="searchVisible = true">
      <md-icon>search</md-icon>
    </md-button>
  </md-toolbar>
</template>

<script>
  export default {
    props: [
      'title'
    ],
    data () {
      return {
        searchVisible: false,
        searchInput: ""
      }
    },
    methods: {
      toggleLeftSidenav () {
        this.$store.commit('openDrawer')
      },
      search () {
        const query = this.searchInput
        this.searchInput = ""
        this.searchVisible = false
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
  .search-input {
    width: 250px;
    margin: 0;
    transition: transform 300ms cubic-bezier(0.165, 0.840, 0.440, 1.000), opacity 300ms cubic-bezier(0.165, 0.840, 0.440, 1.000);
    transform: translateY(-36px) translateX(100%);
    opacity: 0;
    position: absolute;
    right: 64px;
    &.shown {
      transform: translateY(-36px) translateX(0);
      opacity: 1;

    }
  }
  .btn-search-close {
    position: absolute;
    right: 8px;
  }
</style>
