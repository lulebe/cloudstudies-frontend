<template lang="html">
  <div>

    <app-folder
        :files="displayedFolder.files"
        :folders="displayedFolder.folders"
        @openfolder="openFolder"
        @openfile="openFile"
        v-if="store">
    </app-folder>

    <div class="upload-container" v-if="uploadFormVisible">
      <h3 class="md-display-1">Upload new Files</h3>
      <dropzone id="fileUploadZone" :url="fileUploadUrl" :headers="fileUploadHeaders" :maxFileSizeInMB="150" @vdropzone-success="uploadDone"></dropzone>
      <md-button class="md-raised" @click.native="uploadFormVisible = false">Done</md-button>
    </div>

    <md-dialog md-open-from="#store-fab" md-close-to="#store-fab" ref="folderCreationDialog">
      <form @submit.prevent="createFolder">
        <md-dialog-title>Add a new Folder</md-dialog-title>
        <md-dialog-content>
          <md-input-container :class="{'md-input-invalid': !folderNameValid}">
            <label>Folder name</label>
            <md-input type="text" v-model="newFolderName" pattern="[a-zA-Z0-9_\-\. ]+" />
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
  import {ajax} from '../../helpers/ajax'

  import config from '../../config'

  const folderNameRegex = /^[a-z0-9\-_\. ]+$/i

  export default {
    props: [
      'storeid', 'folderpath'
    ],
    data () {
      return {
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
      openFolder (folder) {
        this.$router.push('/app/store/'+this.storeid+folder.name)
      },
      openFile (file) {
        ajax({
          method: 'GET',
          url: config.API_DATA+'/file/'+file.id,
          headers: {
            'x-store-auth': this.$store.state.account.userdata.stores[this.storeid].password
          }
        })
        .then(res => {
          const link = config.API_UPLOAD+'/file/'+res.data.token+'/'+file.name
          window.location.href = link
        })
        .catch(e => {})
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
      }
    }
  }
</script>