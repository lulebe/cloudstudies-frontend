<template>
  <div :class="{uploadRunning: uploading}">
    <button class="info-btn" @click="panelOpen = !panelOpen">
      <span v-if="uploading" class="percentage">{{overallProgress}}%</span>
      <md-icon v-if="!uploading" class="idle-icon">cloud_upload</md-icon>
    </button>
    <transition name="panel">
      <div class="info-panel" v-show="panelOpen">
        <h3>Uploads</h3>
        <md-list class="md-dense md-triple-line">
          <md-list-item
          v-for="upload in uploadQueue"
          :key="upload">
            <div class="md-list-text-container">
              <span><strong>{{upload.name}}</strong></span>
              <span v-if="!upload.done">
                {{Math.round(upload.progress * 1000)/10}}%
                <small style="color: #666">{{upload.uploaded | fileSize}} of {{upload.size | fileSize}}</small>
              </span>
              <span v-if="upload.done && !upload.error" class="upload-info-done">
                <md-icon class="upload-info-done">check</md-icon> done
              </span>
              <span v-if="upload.done && upload.error" class="upload-info-error">
                <md-icon class="upload-info-error">warning</md-icon> failed
              </span>
              <span
                v-if="!upload.done"
                class="progress"
                :style="{background: progressGradientH(upload.progress * 100)}">
              </span>
            </div>
            <md-button class="md-icon-button md-list-action" @click.native="removeUpload(upload)">
              <md-icon>cancel</md-icon>
            </md-button>
          </md-list-item>
        </md-list>
        <div class="no-uploads" v-if="uploadQueue.length == 0">There are currently no uploads.</div>
      </div>
    </transition>
  </div>
</template>
<script>
import axios from 'axios'
import uploads from '../helpers/uploads'
import {ajax} from '../helpers/ajax'
export default {
  data () {
    return {
      panelOpen: false,
      uploading: false,
      uploadQueue: []
    }
  },
  computed: {
    overallProgress () {
      return Math.round(this.uploadQueue.reduce((x,y) => x+y.progress, 0) / this.uploadQueue.length * 100) || 0
    }
  },
  mounted () {
    uploads.uploader = this
  },
  methods: {
    progressGradientH (percentage) {
      let high = percentage+0.1
      let low = percentage
      if (high > 100) {
        low += -0.1
        high += -0.1
      }
      return 'linear-gradient(to right, #43a047 ' + low + '%,#f0f0f0 ' + high + '%)'
    },
    addUpload (file, storeId, url, headers) {
      const upload = {
        file,
        storeId,
        url,
        headers,
        name: file.name,
        try: 0,
        cancel: null,
        progress: 0.0,
        uploaded: 0.0,
        size: file.size,
        done: false,
        error: false
      }
      this.uploadQueue.push(upload)
      if (!this.uploading)
        this.startUpload()
    },
    removeUpload (upload) {
      !upload.done && upload.cancel && upload.cancel()
      const i = this.uploadQueue.indexOf(upload)
      i >= 0 && this.uploadQueue.splice(i,1)
    },
    nextUpload () {
      return this.uploadQueue.filter(i => !i.done)[0] || null
    },
    startUpload () {
      this.uploading = true
      const currentUpload = this.nextUpload()
      currentUpload.try += 1
      const cancelToken = axios.CancelToken.source()
      currentUpload.cancel = cancelToken.cancel
      const formData = new FormData()
      formData.append('files', currentUpload.file, currentUpload.name)
      ajax({
        method: 'post',
        url: currentUpload.url,
        headers: currentUpload.headers,
        data: formData,
        cancelToken: cancelToken.token,
        onUploadProgress: e => {
          currentUpload.uploaded = e.loaded
          currentUpload.progress = e.loaded / e.total
        }
      })
      .then(() => {
        currentUpload.error = false
        currentUpload.done = true
        this.$store.dispatch('stores/fetchStore', {id: currentUpload.storeId})
        .catch(() => {})
        if (this.nextUpload())
          this.startUpload()
        else {
          this.uploading = false
        }
      })
      .catch(() => {
        currentUpload.error = true
        if (currentUpload.try < 2) {
          currentUpload.progress = 0.0
          this.startUpload()
        } else {
          currentUpload.done = true
          if (this.nextUpload())
            this.startUpload()
          else {
            this.uploading = false
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
  .info-btn {
    box-sizing: border-box;
    position: fixed;
    z-index: 30;
    right: 16px;
    bottom: 16px;
    width: 48px;
    height: 48px;
    border-radius: 24px;
    line-height: 38px;
    font-size: 0.8rem;
    text-align: center;
    box-shadow: 0 3px 8px 2px rgba(0,0,0,0.3);
    border: 4px solid white;
    background: white;
    color: black;
    cursor: pointer;
    transition: box-shadow 0.1s ease-out;
    .percentage {
      display: inline-block;
      transform: translateY(-2px);
    }
    .idle-icon {
      transform: translateY(-3px);
      color: #666;
    }
  }
  .info-btn:active {
    box-shadow: 0 8px 16px 3px rgba(0,0,0,0.2);
  }
  .uploadRunning .info-btn {
    animation: info-btn-border 3s infinite;
  }
  .info-panel {
    position: fixed;
    z-index: 25;
    right: 40px;
    bottom: 40px;
    width: 280px;
    height: 220px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    background: white;
    transform-origin: right bottom;
    padding: 16px;
    h3 {
      margin: 0;
      padding: 0;
      font-size: 1.2rem;
    }
  }
  .progress {
    width: 100%;
    height: 8px;
  }
  .upload-info-done {
    color: #43a047;
  }
  .upload-info-error {
    color: #f60;
  }

  .no-uploads {
    text-align: center;
    color: #666;
    margin-top: 64px;
  }

  @keyframes info-btn-border {
    0% {
      border-color: white;
    }
    50% {
      border-color: #43a047;
    }
    100% {
      border-color: white;
    }
  }

  .panel-enter, .panel-leave-to {
    opacity: 0;
    transform: scale(0.75);
  }
  .panel-enter-active, .panel-leave-active {
    transition: opacity 0.2s, transform 0.2s;
  }
</style>
