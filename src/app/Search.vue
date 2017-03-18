<template lang="html">
  <div class="main-container">
    <app-toolbar :title="query" />
    <div class="loading" style="margin-top: 20vh" v-if="!results">
      <div class="loading-info">Searching</div>
      <div class="loading-spinner"></div>
    </div>
    
  </div>
</template>

<script>

  import axios from 'axios'

  import config from '../config'

  export default {
    data () {
      return {
        query: null,
        results: null
      }
    },
    mounted () {
      this.query = this.$route.query.q
      this.search()
    },
    watch: {
      '$route' (to, from) {
        this.query = to.query.q
        this.search()
      }
    },
    methods: {
      search () {
        axios.get(config.API_DATA + '/?q='+this.query)
        .then(res => {
          this.results = res.body
        })
        .catch(e => {})
      }
    }
  }
</script>