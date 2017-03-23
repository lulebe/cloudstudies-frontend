<template lang="html">
    <div class="main-container">
      <app-toolbar :title="storename"></app-toolbar>
      <app-folder :files="[]" :folders="[]" v-if="store"></app-folder>
      <md-speed-dial class="fab" md-direction="bottom" v-if="store">
        <md-button class="md-fab" md-fab-trigger>
          <md-icon md-icon-morph>close</md-icon>
          <md-icon>add</md-icon>
        </md-button>
        <md-button class="md-fab md-primary md-mini md-clean">
          <md-icon>create_new_folder</md-icon>
          <md-tooltip md-direction="left">Create folder</md-tooltip>
        </md-button>
        <md-button class="md-fab md-primary md-mini md-clean">
          <md-icon>cloud_upload</md-icon>
          <md-tooltip md-direction="left">Upload files</md-tooltip>
        </md-button>
      </md-speed-dial>
      <app-form title="Unlock Store" submitBtnText="unlock" v-if="!store" @submit="fetchStore">
        <md-input-container>
          <label>Store Password</label>
          <md-input type="password" v-model="password" />
        </md-input-container>
      </app-form>
    </div>
</template>

<script>
  export default {
    props: [
      'storeid'
    ],
    data () {
      return {
        password: ''
      }
    },
    computed: {
      store () {return this.$store.state.stores[this.storeid]},
      storename () {
        if (this.$store.state.stores[this.storeid])
          return this.$store.state.stores[this.storeid].name
        return 'Store'
      }
    },
    mounted () {
      if (this.$store.state.account.userdata.stores) {
        if (this.$store.state.account.userdata.stores[this.storeid]) {
          this.password = this.$store.state.account.userdata.stores[this.storeid].password
          this.fetchStore(true)
        }
      }
    },
    methods: {
      fetchStore (hashed) {
        this.$store.dispatch('stores/fetchStore', {id: this.storeid, password: this.password, pwhashed: hashed || false})
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fab {
    position: absolute;
    right: 16px;
    top: 80px;
  }
</style>
