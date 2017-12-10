<template>
  <div>
    <form enctype="multipart/form-data" novalidate v-if="isInitial || isSaving">
      <div class="dropbox">
        <input type="file" multiple name="files" :disabled="isSaving" @change="filesChange($event.target.name, $event.target.files); fileCount = $event.target.files.length"
          accept="*/*" class="input-file">
          <p v-if="isInitial">
            Drag your file(s) here to begin<br> or click to browse
          </p>
          <p v-if="isSaving">
            Uploading {{ fileCount }} files: {{uploadProgress}}%
          </p>
          <div class="progress-container" v-if="isSaving">
            <div class="progress" :style="{width: uploadProgress+'%'}"></div>
          </div>
          <md-button class="md-warn" v-if="isSaving" @click.native="cancelUpload()">cancel upload</md-button>
      </div>
    </form>
    <!--SUCCESS-->
    <div v-if="isSuccess" style="text-align: center">
      <h2>Uploaded {{ uploadedFiles.length }} file(s) successfully.</h2>
      <md-button class="md-primary" @click.native="reset()">Upload more files</md-button>
    </div>
    <!--FAILED-->
    <div v-if="isFailed" style="text-align: center">
      <h2>Upload failed.</h2>
      <p>
        {{uploadError}}
      </p>
      <md-button class="md-warn" @click.native="reset()">Try again</md-button>
    </div>
  </div>
</template>
<script>
import axios from 'axios'
import {ajax} from '../helpers/ajax'

const STATUS_INITIAL = 0, STATUS_SAVING = 1, STATUS_SUCCESS = 2, STATUS_FAILED = 3

let cancelToken = null

export default {
  props: ['headers', 'url'],
  data () {
    return {
      uploadedFiles: [],
      uploadError: null,
      currentStatus: null,
      uploadProgress: 0
    }
  },
  computed: {
    isInitial() {
      return this.currentStatus === STATUS_INITIAL
    },
    isSaving() {
      return this.currentStatus === STATUS_SAVING
    },
    isSuccess() {
      return this.currentStatus === STATUS_SUCCESS
    },
    isFailed() {
      return this.currentStatus === STATUS_FAILED
    }
  },
  mounted () {
    this.reset()
  },
  methods: {
    reset() {
      // reset form to initial state
      this.currentStatus = STATUS_INITIAL
      this.uploadedFiles = []
      this.uploadError = null
      this.uploadProgress = 0
    },
    save(formData) {
      // upload data to the server
      this.currentStatus = STATUS_SAVING
      upload(formData, this.url, this.headers, progress => {
        this.uploadProgress = progress
      })
      .then(x => {
        this.uploadedFiles = [].concat(x)
        this.currentStatus = STATUS_SUCCESS
        this.$emit('success')
      })
      .catch(err => {
        if (axios.isCancel(err))
          this.uploadError = 'Upload cancelled.'
        else
          this.uploadError = err.message
        this.currentStatus = STATUS_FAILED
      });
    },
    filesChange(fieldName, fileList) {
      // handle file changes
      const formData = new FormData();
      if (!fileList.length) return;
      // append the files to FormData
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          formData.append(fieldName, fileList[x], fileList[x].name)
        })
      // save it
      this.save(formData)
    },
    cancelUpload () {
      cancelToken && cancelToken.cancel()
      cancelToken = null
      this.reset()
    }
  }
}

function upload(formData, url, headers, progressCb) {
  cancelToken = axios.CancelToken.source()
  return ajax({
    method: 'post',
    url: url,
    headers: headers,
    data: formData,
    cancelToken: cancelToken.token,
    onUploadProgress: e => {
      progressCb(Math.round(e.loaded / e.total * 100))
    }
  })
}
</script>
<style lang="scss" scoped>
  .dropbox {
    border: 2px dashed grey; /* the dash box */
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
    text-align: center;
  }
  
  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }
  
  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }

  .dropbox .progress-container {
    width: 100%;
    height: 24px;
    background: #bbb;
    .progress {
      height: 24px;
      background: #5c5;
    }
  }
</style>
