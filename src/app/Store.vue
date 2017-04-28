<template lang="html">
  <div>
    <app-toolbar :title="storename"></app-toolbar>


    <md-sidenav class="md-right settings-panel" ref="settingsPanel">
      <app-store-settings :store="store" @close="closeSettings"/>
    </md-sidenav>

    <md-toolbar class="md-dense" md-theme="secondarybar" v-if="store">
      <md-button class="md-icon-button" v-if="!displaysRoot" @click.native="goUp">
        <md-icon>arrow_back</md-icon>
      </md-button>
      <h2 class="md-title">{{displayedFolderPath}}</h2>
    </md-toolbar>

    <div class="usage-indicator" v-if="store">
      <div class="percentage" :style="{transform: 'scaleX('+percentageUsed/100+')'}"></div>
      <md-tooltip>
        {{Math.round(percentageUsed)}}% of Storage used
        ({{Math.round(store.size/1024/1024)}}MB/3GB)
      </md-tooltip>
    </div>

    <router-view v-if="store"></router-view>

    <md-button class="md-fab md-mini md-clean fab-settings" v-if="store && !uploadFormVisible && store.owner.id == $store.state.account.user.id" @click.native="openSettings()">
      <md-icon>settings</md-icon>
    </md-button>

    <md-speed-dial class="fab" md-direction="bottom" v-if="store && !uploadFormVisible && $store.state.account.loggedIn">
      <md-button class="md-fab" id="store-fab" md-fab-trigger>
        <md-icon md-icon-morph>close</md-icon>
        <md-icon>add</md-icon>
      </md-button>
      <md-button class="md-fab md-primary md-mini md-clean" @click.native="openFolderCreationDialog">
        <md-icon>create_new_folder</md-icon>
        <md-tooltip md-direction="left">Create folder</md-tooltip>
      </md-button>
      <md-button class="md-fab md-primary md-mini md-clean" @click.native="uploadFormVisible = true">
        <md-icon>cloud_upload</md-icon>
        <md-tooltip md-direction="left">Upload files</md-tooltip>
      </md-button>
      <md-button class="md-fab md-primary md-mini md-clean" @click.native="createTest">
        <md-icon md-src="src/assets/test.svg" style="transform: translateY(-45%)"></md-icon>
        <md-tooltip md-direction="left">Create a Test</md-tooltip>
      </md-button>
    </md-speed-dial>

    <app-form title="Unlock Store" submitBtnText="unlock" v-if="!store" @submit="fetchStore">
      <md-input-container :class="{'md-input-invalid': loadingError}">
        <label>Store Password</label>
        <md-input type="password" v-model="password" />
        <span class="md-error">Password is incorrect</span>
      </md-input-container>
    </app-form>

    <div class="loading" style="margin-top: 20vh" v-if="!store && loading">
      <div class="loading-info">Loading Store</div>
      <div class="loading-spinner"></div>
    </div>

    <div class="upload-container" v-if="uploadFormVisible">
      <h3 class="md-display-1">Upload new Files</h3>
      <dropzone id="fileUploadZone" :url="fileUploadUrl" :headers="fileUploadHeaders" :maxFileSizeInMB="150" :maxNumberOfFiles="250" @vdropzone-success="uploadDone"></dropzone>
      <md-button class="md-raised" @click.native="uploadFormVisible = false">Done</md-button>
    </div>

    <md-dialog md-open-from="#store-fab" md-close-to="#store-fab" ref="folderCreationDialog">
      <form @submit.prevent="createFolder">
        <md-dialog-title>Add a new Folder</md-dialog-title>
        <md-dialog-content>
          <md-input-container :class="{'md-input-invalid': !folderNameValid}">
            <label>Folder name</label>
            <md-input type="text" v-model="newFolderName" pattern="[a-zA-Z0-9_\-\. ]+" ref="newFolderInput" />
            <span class="md-error">Only letters, numbers, spaces, -, _ and . are allowed.</span>
          </md-input-container>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click.native="closeDialog('folderCreationDialog')">Cancel</md-button>
          <md-button class="md-primary" type="submit">Ok</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>

    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="3000">
      <span>an Error occurred</span>
    </md-snackbar>
  </div>
</template>

<script>
  import {ajax} from '../helpers/ajax'

  import config from '../config'

  const folderNameRegex = /^[a-z0-9\-_\. ]+$/i

  export default {
    props: [
      'storeid', 'folderpath'
    ],
    data () {
      return {
        password: '',
        loading: false,
        newFolderName: '',
        uploadFormVisible: false,
        loadingError: false
      }
    },
    computed: {
      store () {return this.$store.state.stores[this.storeid]},
      storename () {
        if (this.store && this.store.success)
          return this.store.name
        return 'Store'
      },
      percentageUsed () {
        const used = this.store ? this.store.size : 0
        return used / 3221225472 * 100
      },
      displayedFolderPath () {
        const base = this.folderpath || ''
        return '/'+base
      },
      displaysRoot () {
        return this.displayedFolderPath == '/'
      },
      displayedFolder () {
        if (this.store && this.store.success) {
          const dFolder = this.store.folders.filter(
            folder => folder.name === this.displayedFolderPath
          )[0]
          dFolder.folders = this.store.folders.filter(
            folder => folder.parentId === dFolder.id
          ).map(folder => {
            folder.shortname = folder.name.replace(/.*\//, '')
            return folder
          })
          return dFolder
        }
        return {id: 0, name: '/', folders: [], files: [], noDelete: true}
      },
      folderNameValid () {
        return /^[a-z0-9\-_\. ]+$/i.test(this.newFolderName) || this.newFolderName.length == 0
      },
      fileUploadUrl () {
        return config.API_UPLOAD + '/folder/' + this.displayedFolder.id
      },
      fileUploadHeaders () {
        return {
          'Authorization': this.$store.state.account.token,
          'x-store-auth': this.$store.state.account.userdata.stores[this.storeid].password
        }
      }
    },
    mounted () {
      if (this.$store.state.account.userdata.stores) {
        if (this.$store.state.account.userdata.stores[this.storeid]) {
          this.fetchStore(true)
        }
      }
    },
    watch: {
      '$route' (to, from) {
        this.password = ''
        if (this.$store.state.account.userdata.stores) {
          if (this.$store.state.account.userdata.stores[this.storeid]) {
            this.fetchStore(true)
          }
        }
      }
    },
    methods: {
      openDialog (ref) {
        this.$refs[ref].open()
      },
      closeDialog (ref) {
        this.$refs[ref].close()
        this.newFolderName = ''
      },
      openFolderCreationDialog () {
        this.openDialog('folderCreationDialog')
        setTimeout(() => this.$refs['newFolderInput'].$el.focus(), 300)
      },
      openSettings () {
        this.$refs.settingsPanel.open()
      },
      closeSettings () {
        this.$refs.settingsPanel.close()
      },
      fetchStore (fromUserdata) {
        this.loading = true
        const data = {id: this.storeid}
        if (!fromUserdata)
          data.password = this.password
        this.$store.dispatch('stores/fetchStore', data)
        .then(res => {
          this.loading = false
          if (!res.success)
            this.loadingError = true
        })
      },
      goUp () {
        this.uploadFormVisible = false
        if (this.displaysRoot) return
        const path = this.store.folders.filter(f =>
          f.id === this.displayedFolder.parentId
        )[0].name
        this.$router.push('/app/store/'+this.storeid+path)
      },
      createFolder () {
        const shortname = this.newFolderName
        this.$store.dispatch('stores/addFolder', {
          shortname,
          store: this.store,
          parentId: this.displayedFolder.id})
        .then (() => {
          this.newFolderName = ''
          this.$refs['folderCreationDialog'].close()
        })
        .catch(e => {
          this.newFolderName = ''
          this.$refs['folderCreationDialog'].close()
          this.$refs.snackbar.open()
        })
      },
      uploadDone (file, res) {
        this.fetchStore(true)
      },
      createTest () {
        const currentRoute = this.$route.fullPath.replace(/\/$/, '')
        this.$router.push(currentRoute+'/newtest')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fab {
    position: absolute;
    right: 16px;
    top: 86px;
  }
  .fab-settings {
    position: absolute;
    right: 80px;
    top: 90px;
  }
  .upload-container {
    position: absolute;
    z-index: 3;
    top: 120px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,0.9);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 24px;
    .dropzone {
      width: 100%;
      margin: 24px 0;
      flex-grow: 1;
    }
  }

  .usage-indicator {
    width: 100%;
    background: #eee;
    .percentage {
      height: 8px;
      background: grey;
      transition: transform 0.6s ease-out;
      transform-origin: left;
    }
    &:hover {
      background: #afa;
      .percentage {
        background: #e33;
      }
    }
  }
</style>
<style lang="scss">
  .settings-panel .md-sidenav-content {
    width: 90vw;
  }
  @media (min-width: 600px) {
    .settings-panel .md-sidenav-content {
      width: 360px;
    }
  }
</style>
