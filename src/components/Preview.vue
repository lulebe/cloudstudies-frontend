<template>
  <div class="preview-container" v-if="opened">
    <md-toolbar>
      <md-button class="md-icon-button" @click.native="close">
        <md-icon>close</md-icon>
      </md-button>
      <h1 class="md-title">Preview: {{file.name}}</h1>
    </md-toolbar>
    <!--
    <div v-if="!hasPreview" class="info-no-preview">
      There is no preview for this file.
    </div>
    -->
    <iframe ref="previewFrame" class="preview-frame"></iframe>
  </div>
</template>
<script>
  import {ajax} from '../helpers/ajax'

  import config from '../config'

  export default {
    data () {
      return {
        file: null,
        opened: false
      }
    },
    computed: {
      hasPreview() {return this.file.previewFileCount && this.file.previewFileCount > 0}
    },
    methods: {
      open (file, password) {
        this.file = file
        this.opened = true
        ajax({
            method: 'GET',
            url: config.API_DATA+'/file/'+file.id,
            headers: {
              'x-store-auth': password
            }
          })
          .then(res => {
            const link = config.API_UPLOAD+'/file/'+res.data.token+'/'+file.name
            this.$refs['previewFrame'].src = link
          })
          .catch(e => {
            console.log(e)
          })
      },
      close () {
        this.opened = false
        this.file = null
      }
    }
  }
</script>
<style lang="scss" scoped>
  .preview-container {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    overflow: auto;
    background: rgba(0,0,0,0.8);
    z-index: 23;
    color: white;
  }
  .info-no-preview {
    width: 100%;
    text-align: center;
    padding-top: 100px;
    font-size: 1.5rem;
    font-weight: bold;
  }
  .preview-frame {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
  }
</style>
