<template lang="html">
  <div>
    <app-toolbar title="Dashboard"></app-toolbar>
    <div class="stores-empty" v-if="userStoreKeys.length == 0 && memberStores.length == 0 && ownedStores.length == 0">
      You have no Stores in your account.
      <p>
        Create a new Store or search for a store or use its link and add it to your account.
      </p>
    </div>
    <div class="content" v-if="userStoreKeys.length > 0 || memberStores.length > 0 || ownedStores.length > 0">
    <span class="md-subhead">your Stores</span>
    <div class="store-list">
      <md-whiteframe class="store" v-for="store in ownedStores" :key="store.id" @click.native="openStore(store.id)">
        <md-ink-ripple />
        <span class="md-title">{{store.name}}</span>
      </md-whiteframe>
    </div>
      <span class="md-subhead">saved Stores</span><br>
      <div class="store-list">
        <md-whiteframe class="store" v-for="key in userStoreKeys" :key="key" @click.native="openStore(userStores[key].store.id)">
          <md-ink-ripple />
          <span class="md-title">
            {{userStores[key].store.name}}
            <md-icon :style="{color: stores[key] ? 'black' : 'lightgrey'}">check</md-icon>
          </span>
          <br>
          {{userStores[key].store.owner.name}}
        </md-whiteframe>
      </div>
      <span class="md-subhead">Stores you're a member of</span><br>
      <div class="store-list">
        <md-whiteframe class="store" v-for="store in memberStores" :key="store.id" @click.native="openStore(store.id)">
          <md-ink-ripple />
          <span class="md-title">{{store.name}}</span><br>
          {{store.owner.name}}
        </md-whiteframe>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    computed: {
      stores () {return this.$store.state.stores},
      userStores () {return this.$store.state.account.userdata.stores},
      memberStores () {
        return this.$store.state.account.memberStores
        .filter(s => s.ownerId != this.$store.state.account.user.id)
      },
      ownedStores () {return this.$store.state.account.ownedStores},
      userStoreKeys () {
        const keys = []
        for (var prop in this.$store.state.account.userdata.stores) {
          if (this.$store.state.account.userdata.stores.hasOwnProperty(prop))
            if (this.$store.state.stores[prop].ownerId != this.$store.state.account.user.id)
              keys.push(prop)
        }
        return keys
      }
    },
    mounted () {
      this.fetchStores()
      this.$store.dispatch('account/fetchOwnedStores')
      this.$store.dispatch('account/fetchMemberStores')
    },
    watch: {
      userStoreKeys () {
        this.fetchStores()
      }
    },
    methods: {
      openStore (storeId) {
        this.$router.push('/app/store/'+storeId)
      },
      fetchStores () {
        this.userStoreKeys.forEach(storeId => {
          if (!this.stores[storeId])
          this.$store.dispatch('stores/fetchStore', {id: storeId})
        })
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
      padding: 12px;
      cursor: pointer;
      margin: 4px;
    }
  }
</style>
