<template lang="html">
  <div>
    <app-toolbar title="Store"></app-toolbar>
    <div class="loading" style="margin-top: 20vh" v-if="loading">
      <div class="loading-info">Loading your Store</div>
      <div class="loading-spinner"></div>
    </div>
    <h1 v-if="!loading">Incorrect link</h1>
  </div>
</template>

<script>
  export default {
    props: ['storeid', 'storelink'],
    data () {
      return {
        loading: true
      }
    },
    mounted () {
      this.$store.dispatch('stores/fetchFromLink', {id: this.storeid, linkHash: this.storelink})
      .then(result => {
        if (!result.success)
          this.loading = false
        else
          this.$router.push('/app/store/'+this.storeid)
      })
    }
  }
</script>

<style lang="scss">
</style>
