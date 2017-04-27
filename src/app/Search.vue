<template lang="html">
  <div>
    <app-toolbar :title="query" />
    <div class="loading" style="margin-top: 20vh" v-if="!results">
      <div class="loading-info">Searching</div>
      <div class="loading-spinner"></div>
    </div>
    <div class="content" v-if="results">
      <span class="md-subheading">Results</span>
      <div class="results-grid">
        <md-button v-for="result in results" :key="result.id" class="result md-raised" @click.native="openResult(result)">
          <md-icon>cloud</md-icon>
          {{result.name}}
        </md-button>
      </div>
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
        axios.get(config.API_DATA + '/stores?q='+this.query, {
          headers: {
            Authorization: this.$store.state.account.token
          }
        })
        .then(res => {
          this.results = res.data
        })
        .catch(e => {})
      },
      openResult (result) {
        this.$router.push('/app/store/'+result.id)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .results-grid {
    display: flex;
    flex-wrap: wrap;
  }
  .results-grid .result {
    padding: 6px 16px;
    text-transform: none;
  }
</style>
