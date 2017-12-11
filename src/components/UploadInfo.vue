<template>
  <div :class="{uploadRunning: uploading}">
    <button class="info-btn" @click="panelOpen = !panelOpen">
      <span v-if="uploading">{{overallProgress}}%</span>
      <md-icon v-if="!uploading">cloud</md-icon>
    </button>
    <transition name="panel">
      <div class="info-panel" v-show="panelOpen">
        <h3>Uploads</h3>
        <md-list class="md-dense md-double-line">
          <md-list-item
          v-for="upload in uploadQueue"
          :key="upload">
            <div class="md-list-text-container">
              <span><strong>{{upload.name}}</strong></span>
              <span>{{Math.round(upload.progress * 1000)/10}}%</span>
              <div class="progress" :style="{background: progressGradientH(upload.progress * 100)}"></div>
            </div>
          </md-list-item>
        </md-list>
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
    addUpload (file, name, url, headers) {
      const upload = {file, name, url, headers, try: 0, cancel: null, progress: 0.0}
      this.uploadQueue.push(upload)
      if (!this.uploading)
        this.startUpload()
    },
    removeUpload (upload) {
      const i = this.uploadQueue.indexOf(upload)
      i >= 0 && this.uploadQueue.splice(i,1)
    },
    startUpload () {
      this.uploading = true
      const currentUpload = this.uploadQueue[0]
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
          currentUpload.progress = e.loaded / e.total
        }
      })
      .then(() => {
        this.uploadQueue.splice(0,1)
        if (this.uploadQueue.length > 0)
          this.startUpload()
        else {
          this.uploading = false
        }
      })
      .catch(() => {
        if (currentUpload.try < 2) {
          this.startUpload()
        } else {
          this.uploadQueue.splice(0,1)
          if (this.uploadQueue.length > 0)
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
    left: 24px;
    bottom: 24px;
    width: 64px;
    height: 64px;
    border-radius: 32px;
    line-height: 52px;
    font-size: 1rem;
    text-align: center;
    box-shadow: 0 3px 8px 2px rgba(0,0,0,0.3);
    border: 4px solid white;
    background: white;
    color: black;
    cursor: pointer;
    transition: box-shadow 0.1s ease-out;
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
    left: 56px;
    bottom: 56px;
    width: 280px;
    height: 220px;
    overflow-y: auto;
    overflow-x: hidden;
    border-radius: 8px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.3);
    background: white;
    transform-origin: left bottom;
    padding: 16px;
    h3 {
      margin: 0;
      padding: 0;
      font-size: 1.2rem;
    }
    .progress {
      width: 100%;
      height: 8px;
    }
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
    transition: opacity 0.35s, transform 0.35s;
  }
</style>
