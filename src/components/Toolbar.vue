<template lang="html">
  <div style="position: relative;">
    <md-toolbar class="main-toolbar">
      <md-button
          class="md-icon-button drawer-open-btn"
          @click.native="toggleLeftSidenav"
          v-if="$store.state.account.loggedIn">
        <md-icon>menu</md-icon>
      </md-button>
      <div class="toolbar-title-container">
        <h1 class="md-title toolbar-title">{{title}}</h1>
        <div class="toolbar-actions-shadow"></div>
      </div>
      <md-button class="md-icon-button" @click.native="openSearch" v-if="$store.state.account.loggedIn">
        <md-icon>search</md-icon>
      </md-button>
      <md-menu v-if="menuItems && menuItems.length>0">
        <md-button class="md-icon-button" md-menu-trigger>
          <md-icon>more_vert</md-icon>
        </md-button>
        <md-menu-content>
          <md-menu-item v-for="item in menuItems" :key="item.text">
            <md-icon>{{item.icon}}</md-icon>
            <span>{{item.text}}</span>
          </md-menu-item>
        </md-menu-content>
      </md-menu>
    </md-toolbar>
    <md-toolbar class="search-bar" :class="{shown: searchVisible}" md-theme="searchbar" v-if="$store.state.account.loggedIn">
      <md-button class="md-icon-button" @click.native="closeSearch">
        <md-icon>close</md-icon>
      </md-button>
      <form v-on:submit.prevent="search" style="margin-left: 8px; margin-right: 16px; flex: 1;">
        <md-input-container class="search-input" md-inline>
          <label>Search</label>
          <md-input v-model="searchInput" ref="searchInputField"></md-input>
        </md-input-container>
      </form>
    </md-toolbar>
  </div>
</template>

<script>
  export default {
    props: [
      'title',
      'menuItems'
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
      openSearch () {
        this.searchInput = ""
        this.searchVisible = true
        setTimeout(() => {this.$refs.searchInputField.$el.focus()}, 200)
      },
      closeSearch () {
        this.$refs.searchInputField.$el.blur()
        this.searchVisible = false
      },
      search () {
        const query = this.searchInput
        this.searchInput = ""
        this.searchVisible = false
        setTimeout(() => this.$router.push({path: '/app/search', query: {q: query}}), 200)
      }
    }
  }
</script>

<style lang="scss">
  @media (min-width: 600px) {
    .drawer-open-btn {
      display: none;
    }
    .main-toolbar .md-title.toolbar-title {
      margin-left: 8px;
    }
  }
  .main-toolbar .toolbar-title-container {
    flex: 1;
    white-space: nowrap;
    width: 0;
    overflow: hidden;
    position: relative;
  }
  .main-toolbar .toolbar-actions-shadow {
    position: absolute;
    height: 100%;
    width: 40px;
    right: 0;
    top: 0;
    background: linear-gradient(to right, rgba(67,160,71, 0), rgba(67,160,71,1));
  }
  .search-bar {
    position: absolute;
    top: 0;
    width: 100%;
    transform: translateX(100%);
    transition-duration: 200ms;
    &.shown {
      transform: translateY(0);
    }
  }
  .search-input {
    width: 100%;
    margin: 0;
    transform: translateY(-12px);
  }
</style>
