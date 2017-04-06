<template>
  <div id="app">
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
        <md-subheader>my Stores</md-subheader>
        <md-list-item>
          <router-link to="/app/newstore"><md-icon>add</md-icon><span>new Store</span></router-link>
        </md-list-item>
        <md-list-item class="md-inset" v-for="key in userStoreKeys" :key="key">
          <router-link :to="'/app/store/'+userStores[key].store.id"><span>{{userStores[key].store.name}}</span></router-link>
        </md-list-item>
        <md-subheader>saved Stores</md-subheader>
        <md-list-item class="md-inset" v-for="key in userStoreKeys" :key="key">
          <router-link :to="'/app/store/'+userStores[key].store.id"><span>{{userStores[key].store.name}}</span></router-link>
        </md-list-item>
      </md-list>
    </md-sidenav>
    <router-view></router-view>
  </div>
</template>

<script>
  export default {
    name: 'app',
    data () {
      return {
      }
    },
    computed: {
      username () {return this.$store.state.account.loggedIn ? this.$store.state.account.user.name : null},
      userStores () {return this.$store.state.account.userdata.stores},
      userStoreKeys () {
        const keys = []
        for (var prop in this.$store.state.account.userdata.stores) {
          if (this.$store.state.account.userdata.stores.hasOwnProperty(prop))
            keys.push(prop)
        }
        return keys
      },
      drawerOpen () {return this.$store.state.drawerOpen}
    },
    methods: {
      signout () {
        window.location.href = '/app.html'
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
    position: relative;
    min-height: 100vh;
  }
  .drawer.md-left .md-sidenav-content {
    transition: transform 0.2s ease-out, width 0.4s ease-out;
  }
  @media (min-width: 600px) {
    .main-container {
      transition: margin-left 0.4s ease-out;
      margin-left: 240px;
    }
    .drawer-open-btn {
      visibility: hidden;
    }
    .drawer.md-left .md-sidenav-content {
      transform: translateX(0);
      box-shadow: -13px 0 10px 15px rgba(0,0,0,0.3);
      pointer-events: auto;
      bottom: 120px !important;
      width: 240px;
    }
  }
  @media (min-width: 1024px) {
    .main-container {
      margin-left: 304px;
    }
    .drawer.md-left .md-sidenav-content {
      width: 304px;
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
    height: 112px;
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
