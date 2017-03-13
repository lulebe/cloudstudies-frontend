<template>
  <div id="app">
    <router-view></router-view>
    <md-sidenav class="md-left drawer" ref="leftSidenav" @close="$store.commit('closeDrawer')">
      <div class="navdrawerheader">
        <div class="username">{{username}}</div>
        <div class="buttons">
          <md-button class="md-icon-button" @click.native="$router.push('/app/profile')" style="float: left;">
            <md-icon>settings</md-icon>
          </md-button>
          <md-button @click.native="signout" style="float: right;">Logout</md-button>
        </div>
      </div>
      <md-list class="navdrawerlist">
        <md-list-item>
          <router-link to="/app/dashboard"><md-icon>dashboard</md-icon><span>Dashboard</span></router-link>
        </md-list-item>
        <md-divider></md-divider>
        <md-subheader>Stores</md-subheader>
        <md-list-item>
          <router-link to="/app/newstore"><md-icon>add</md-icon><span>new Store</span></router-link>
        </md-list-item>
        <md-list-item class="md-inset">
          <router-link to="/app/store/5"><span>some Store</span></router-link>
        </md-list-item>
      </md-list>
    </md-sidenav>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
        test: 5
      }
    },
    computed: {
      username () {return this.$store.state.account.loggedIn ? this.$store.state.account.user.name : null},
      drawerOpen () {return this.$store.state.drawerOpen}
    },
    methods: {
      signout () {
        this.$store.commit('closeDrawer')
        this.$store.commit('signout')
        this.$router.push('/')
      }
    },
    watch: {
      drawerOpen () {
        if (this.$store.state.drawerOpen)
          this.$refs.leftSidenav.open()
        else
          this.$refs.leftSidenav.close()
      },
      '$route' (to, from) {
        this.$store.commit('closeDrawer')
      }
    }
  }
</script>

<style lang="scss">
  .content {
    padding: 16px;
  }
  .main-container {
    flex: 1;
    position: relative;
  }
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
    .md-sidenav-content {
      bottom: 120px !important;
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
    height: 150px;
    color: white;
    padding: 24px 16px 8px 16px;
    display: flex;
    flex-direction: column;
    .username {
      font-size: 1rem;
      flex-grow: 1;
    }
    .buttons {
      width: 100%;
    }
  }
  .navdrawerlist a {
    color: #333;
  }
</style>
