<template>
  <div class="preview-container" v-if="opened">
    <md-toolbar>
      <md-button class="md-icon-button" @click.native="close">
        <md-icon>close</md-icon>
      </md-button>
      <h1 class="md-title">Preview: {{file.name}}</h1>
    </md-toolbar>
    <div class="preview-wrapper">
      <div v-if="previewType == null" class="info-no-preview">
        There is no preview for this file.
      </div>
      <img
          class="preview-image" 
          :class="{'preview-image-single': previewArray.length == 1}"
          v-if="previewType == 1 || previewType == 2"
          v-for="num in previewArray"
          :key="num"
          :src="previewLink + num"
      />
    </div>
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
      previewType() {
        if (this.file == null) return null
        if (!this.file.previewFileCount) return null
        return getPreviewType(this.file.name)
      },
      previewArray() {
        return Array.apply(null, {length: this.file.previewFileCount}).map(Number.call, Number)
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
            const link = config.API_UPLOAD+'/file/preview/'+file.name+'/'+res.data.token+'/'
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
    if (!filename) return null
    const extension = filename.split('.').pop().toLowerCase()
    if (imageExtensions.indexOf(extension) > -1)
      return 1
    if (extension == 'pdf')
      return 2
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
    background: rgba(0,0,0,0.8);
    z-index: 23;
    color: white;
  }
  .preview-wrapper {
    position: absolute;
    top: 64px;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    flex-direction: column;
    align-items: center;
    overflow: auto;
  }
  .info-no-preview {
    font-size: 1.5rem;
    font-weight: bold;
    margin: auto 0;
  }
  .preview-image {
    max-width: 100%;
    max-height: calc(100vh - 72px);
    margin-top: 8px;
  }
  .preview-image-single {
    margin: auto 0;
  }
</style>
