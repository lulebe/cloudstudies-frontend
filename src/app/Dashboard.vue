<template lang="html">
  <div class="main-container">
    <app-toolbar title="Dashboard"></app-toolbar>
    <div class="stores-empty" v-if="!userStores">
      You have no Stores in your account.
      <p>
        Create a new Store or search for a store or use its link and add it to your account.
      </p>
    </div>
    <div class="store-list" v-if="userStores">
      <md-whiteframe class="store" v-for="store in userStores" v-key="store.id" @click.native="openStore(store.id)">
        <md-ink-ripple />
        <span class="md-title">{{store.name}}</span><br>
      </md-whiteframe>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      userStores () {
        return this.$store.state.account.userdata
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
