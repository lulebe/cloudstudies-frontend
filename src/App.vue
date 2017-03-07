<template>
  <div id="app">
    <div class="main-container">
      <md-toolbar>
        <md-button class="md-icon-button drawer-open-btn" @click.native="toggleLeftSidenav">
          <md-icon>menu</md-icon>
        </md-button>
        <router-link tag="h1" class="md-title homelink" to="/app">Cloud Studies</router-link>
      </md-toolbar>
    </div>
    <md-sidenav class="md-left drawer" ref="leftSidenav">
      <div class="navdrawerheader">
        <div class="username">{{username}}</div>
        <md-button class="btn-logout" @click.native="signout">Logout</md-button>
      </div>
      <md-list class="navdrawerlist">
        <md-list-item>
          <router-link to="/app"><md-icon>dashboard</md-icon><span>Dashboard</span></router-link>
        </md-list-item>
        <md-list-item>
          <router-link to="/newstore"><md-icon>add</md-icon><span>new Store</span></router-link>
        </md-list-item>
        <md-divider></md-divider>
        <md-subheader>Stores</md-subheader>
        <md-list-item class="md-inset">
          <router-link to="/store/5"><span>some Store</span></router-link>
        </md-list-item>
      </md-list>
    </md-sidenav>
  </div>
</template>

<script>
  import store from './state/main'

  export default {
    name: 'app',
    data () {
      return {
        test: 5
      }
    },
    computed: {
      username: () => store.state.loggedIn ? store.state.user.name : null
    },
    methods: {
      toggleLeftSidenav () {
        this.$refs.leftSidenav.toggle()
      },
      signout () {
        store.commit('signout')
        this.$router.push('/')
      }
    }
  }
</script>

<style lang="scss">
  @media (min-width: 1025px) {
    .main-container {
      transition: padding-left 0.4s ease-out;
      padding-left: 304px;
    }
    .drawer-open-btn {
      visibility: hidden;
    }
    .drawer.md-left .md-sidenav-content {
      transform: translateX(0);
      box-shadow: -3px 0 5px 5px rgba(0,0,0,0.2);
      pointer-events: auto;
    }
  }
  .md-raised.md-focusfix:focus {
    box-shadow: 0 5px 12px 0px rgba(0,0,0,0.5);
    transform: scale(1.02);
  }
  .homelink:hover {
    cursor: pointer;
    color: white;
    text-shadow: 0 0 5px rgba(0,0,0,0.2);
    transform: translateY(-1px);
  }
  .homelink:active {
    transform: translateY(0px);
  }
  .navdrawerheader {
    background: linear-gradient(to bottom, rgba(0,0,0,0.7) 0%,rgba(0,0,0,0.1) 50%,rgba(0,0,0,0.1) 100%), url("/src/assets/drawer_header.png");
    height: 200px;
    color: white;
    padding: 24px;
    display: flex;
    flex-direction: column;
    .username {
      font-size: 1rem;
      flex-grow: 1;
    }
    .btn-logout {
      align-self: flex-end;
    }
  }
  .navdrawerlist a {
    color: #333;
  }
</style>
