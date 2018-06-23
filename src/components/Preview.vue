<template>
  <div class="preview-container" v-if="opened">
    <md-toolbar>
      <md-button class="md-icon-button" @click.native="close">
        <md-icon>close</md-icon>
      </md-button>
      <h1 class="md-title">Preview: {{file.name}}</h1>
    </md-toolbar>
    <div v-if="!hasPreview" class="info-no-preview">
      There is no preview for this file.
    </div>
    <img class="preview-image" v-if="previewType == 'image'" :src="previewLink" />
  </div>
</template>
<script>
  import {ajax} from '../helpers/ajax'

  import config from '../config'

  export default {
    data () {
      return {
        file: null,
        opened: false,
        previewLink: null
      }
    },
    computed: {
      hasPreview() {
        return /*this.file.previewFileCount && this.file.previewFileCount > 0 && */getPreviewType(this.file.name) != null
      },
      previewType() {
        return getPreviewType(this.file.name)
      }
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
            this.previewLink = link
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
  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff']
  function getPreviewType (filename) {
    const extension = filename.split('.').pop().toLowerCase()
    if (imageExtensions.indexOf(extension) > -1)
      return 1
    return null
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
  .preview-image {
    position: relative;
    top: 64px;
    margin: 0 auto;
    display: block;
    width: 100%;
    max-width: 640px;
    height: calc(100vh - 64px);
    max-height: 640px;
  }
</style>
