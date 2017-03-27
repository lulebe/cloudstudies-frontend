<template lang="html">
  <div class="main-container">
    <app-toolbar title="Dashboard"></app-toolbar>
    <div class="stores-empty" v-if="userStoreKeys.length == 0">
      You have no Stores in your account.
      <p>
        Create a new Store or search for a store or use its link and add it to your account.
      </p>
    </div>
    <div class="content" v-if="userStoreKeys.length > 0">
      <span class="md-subhead">Stores you own</span><br>
      <div class="store-list">
        <md-whiteframe class="store" v-for="key in userStoreKeys" :key="key" @click.native="openStore(userStores[key].store.id)">
          <md-ink-ripple />
          <span class="md-title">{{userStores[key].store.name}}</span><br>
          {{userStores[key].store.owner.name}}
        </md-whiteframe>
      </div>
      <span class="md-subhead">saved Stores</span>
      <div class="store-list">
        <md-whiteframe class="store" v-for="key in userStoreKeys" :key="key" @click.native="openStore(userStores[key].store.id)">
          <md-ink-ripple />
          <span class="md-title">{{userStores[key].store.name}}</span><br>
          {{userStores[key].store.owner.name}}
        </md-whiteframe>
      </div>
      <span class="md-subhead">Stores you're a member of</span><br>
      <div class="store-list">
        <md-whiteframe class="store" v-for="key in userStoreKeys" :key="key" @click.native="openStore(userStores[key].store.id)">
          <md-ink-ripple />
          <span class="md-title">{{userStores[key].store.name}}</span><br>
          {{userStores[key].store.owner.name}}
        </md-whiteframe>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      userStores () {return this.$store.state.account.userdata.stores},
      userStoreKeys () {
        const keys = []
        for (var prop in this.$store.state.account.userdata.stores) {
          if (this.$store.state.account.userdata.stores.hasOwnProperty(prop))
            keys.push(prop)
        }
        return keys
      }
    },
    methods: {
      openStore (storeId) {
        this.$router.push('/app/store/'+storeId)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .stores-empty {
    margin-top: 35vh;
    padding: 0 24px;
    text-align: center;
    font-size: 2rem;
    color: #999;
    line-height: 3rem;
    p {
      font-size: 0.8rem;
      line-height: 1rem;
      color: #666;
    }
  }
  .store-list {
    display: flex;
    flex-wrap: wrap;
    padding: 16px;
    .store {
      position: relative;
      padding: 16px;
      cursor: pointer;
    }
  }
</style>
