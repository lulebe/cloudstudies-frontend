<template lang="html">
    <div class="main-container">
      <app-toolbar :title="storename"></app-toolbar>

      <app-folder
          :name="displayedFolder.name"
          :files="displayedFolder.files"
          :folders="displayedFolder.folders"
          :isroot="displaysRoot"
          @goUp="goUp"
          @openfolder="openFolder"
          @openfile="openFile"
          v-if="store">
      </app-folder>

      <md-button class="md-fab md-mini md-clean fab-settings" v-if="store && !uploadFormVisible && store.owner.id == $store.state.account.user.id" @click.native="openSettings()">
        <md-icon>settings</md-icon>
      </md-button>

      <md-sidenav class="md-right settings-panel" ref="settingsPanel">
        <md-toolbar md-theme="secondarybar">
          <div class="md-toolbar-container">
            <md-button class="md-icon-button" @click.native="closeSettings()">
              <md-icon>close</md-icon>
            </md-button>
            <h3 class="md-title">Store Settings</h3>
          </div>
        </md-toolbar>
        <div style="padding: 16px;">
          <form @submit.prevent="saveSettings" autocomplete="off">
            <md-input-container md-has-password>
              <label>Store Password</label>
              <md-input type="password" v-model="settings.password" pattern=".{8,}" required></md-input>
            </md-input-container>
            <small>
              This will be the key to unlock your Store, so others will have it.
              Don't choose the same as your login password.
            </small>
            <hr>
            <md-radio v-model="settings.access" name="access" md-value="0">invitations only</md-radio><br>
            <small>
              You have to invite users to the Store and they need the password.
            </small><br>
            <md-radio v-model="settings.access" name="access" md-value="1">anyone with password</md-radio><br>
            <small>
              Everyone can access the Store with the Store password.
            </small><br>
            <md-radio v-model="settings.access" name="access" md-value="2">anyone with password or access link</md-radio><br>
            <small>
              Everyone can access the Store with the password, plus you can give people an access link to the store
              for passwordless access.
            </small>
            <br>
            <md-button class="md-primary">reset link</md-button>
            <hr>
            <md-button class="md-raised md-accent">save</md-button>
          </form>
          <h3>Invitations</h3>
          <form @submit.prevent="inviteUser" autocomplete="off">
            <md-input-container>
              <label>Invite User</label>
              <md-input type="text" pattern=".{8,}" required></md-input>
            </md-input-container>
          </form>
        </div>
      </md-sidenav>

      <md-speed-dial class="fab" md-direction="bottom" v-if="store && !uploadFormVisible">
        <md-button class="md-fab" id="store-fab" md-fab-trigger>
          <md-icon md-icon-morph>close</md-icon>
          <md-icon>add</md-icon>
        </md-button>
        <md-button class="md-fab md-primary md-mini md-clean" @click.native="openDialog('folderCreationDialog')">
          <md-icon>create_new_folder</md-icon>
          <md-tooltip md-direction="left">Create folder</md-tooltip>
        </md-button>
        <md-button class="md-fab md-primary md-mini md-clean" @click.native="uploadFormVisible = true">
          <md-icon>cloud_upload</md-icon>
          <md-tooltip md-direction="left">Upload files</md-tooltip>
        </md-button>
      </md-speed-dial>

      <app-form title="Unlock Store" submitBtnText="unlock" v-if="!store && !loading" @submit="fetchStore">
        <md-input-container>
          <label>Store Password</label>
          <md-input type="password" v-model="password" />
        </md-input-container>
      </app-form>

      <div class="loading" style="margin-top: 20vh" v-if="loading">
        <div class="loading-info">Loading Store</div>
        <div class="loading-spinner"></div>
      </div>

      <div class="upload-container" v-if="uploadFormVisible">
        <h3 class="md-display-1">Drop files here to upload</h3>
        <div>
          <p class="md-body-2">Or select a file:</p>
          <input type="file" name="" value="">
          <br><br><br><br>
        </div>
        <md-button class="md-raised" @click.native="uploadFormVisible = false">cancel Upload</md-button>
      </div>

      <md-dialog md-open-from="#store-fab" md-close-to="#store-fab" ref="folderCreationDialog">
        <md-dialog-title>Add a new Folder</md-dialog-title>
        <md-dialog-content>
          <md-input-container>
            <label>Folder name</label>
            <md-input type="text" v-model="newFolderName" />
          </md-input-container>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click.native="closeDialog('folderCreationDialog')">Cancel</md-button>
          <md-button class="md-primary" @click.native="createFolder">Ok</md-button>
        </md-dialog-actions>
      </md-dialog>

      <md-snackbar md-position="bottom center" ref="snackbar" md-duration="3000">
        <span>an Error occurred</span>
      </md-snackbar>
    </div>
</template>

<script>
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
        settings: {
          password: '',
          access: 1
        }
      }
    },
    computed: {
      store () {return this.$store.state.stores[this.storeid]},
      storename () {
        if (this.$store.state.stores[this.storeid])
          return this.$store.state.stores[this.storeid].name
        return 'Store'
      },
      displayedFolderPath () {
        const base = this.folderpath || ''
        return '/'+base
      },
      displaysRoot () {
        return this.displayedFolderPath == '/'
      },
      displayedFolder () {
        if (this.$store.state.stores[this.storeid]) {
          const dFolder = this.$store.state.stores[this.storeid].folders.filter(
            folder => folder.name === this.displayedFolderPath
          )[0]
          dFolder.folders = this.$store.state.stores[this.storeid].folders.filter(
            folder => folder.parentId === dFolder.id
          ).map(folder => {
            folder.shortname = folder.name.replace(/.*\//, '')
            return folder
          })
          return dFolder
        }
        return {name: '/', folders: [], files: [], noDelete: true}
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
      openSettings () {
        this.$refs.settingsPanel.open()
      },
      closeSettings () {
        this.$refs.settingsPanel.close()
      },
      fetchStore (fromUserdata) {
        if (fromUserdata)
        this.$store.dispatch('stores/fetchStore', {id: this.storeid})
        else
        this.$store.dispatch('stores/fetchStore', {id: this.storeid, password: this.password})
      },
      goUp () {
        this.uploadFormVisible = false
        if (this.displaysRoot) return
        const path = this.$store.state.stores[this.storeid].folders.filter(f =>
          f.id === this.displayedFolder.parentId
        )[0].name
        this.$router.push('/app/store/'+this.storeid+path)
      },
      openFolder (folder) {
        this.$router.push('/app/store/'+this.storeid+folder.name)
      },
      openFile (file) {
        alert(file)
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
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fab {
    position: absolute;
    right: 16px;
    top: 82px;
  }
  .fab-settings {
    position: absolute;
    right: 80px;
    top: 86px;
  }
  .upload-container {
    position: absolute;
    z-index: 3;
    top: 112px;
    left: 0;
    right: 0;
    bottom: 0;
    background: rgba(255,255,255,0.9);
    border: 8px dashed grey;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
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
