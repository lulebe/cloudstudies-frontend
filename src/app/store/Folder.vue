<template lang="html">
  <div>

    <app-folder
        :files="displayedFolder.files"
        :folders="displayedFolder.folders"
        :admin="store.owner.id == userId"
        @openfolder="openFolder"
        @openfile="openFile"
        @downloadfile="downloadFile"
        @renamefile="openRenameFileDialog"
        @movefile="openMoveFileDialog"
        @deletefile="openDeleteFileDialog"
        v-if="store">
    </app-folder>

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

    <md-dialog ref="fileRenameDialog">
      <form @submit.prevent="renameFile">
        <md-dialog-title>Rename file</md-dialog-title>
        <md-dialog-content>
          <md-input-container>
            <label>File name</label>
            <md-input type="text" v-model="newFileName" />
          </md-input-container>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click.native="closeDialog('fileRenameDialog')">Cancel</md-button>
          <md-button class="md-primary" type="submit">Ok</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>

    <md-dialog ref="fileMoveDialog">
      <form @submit.prevent="moveFile">
        <md-dialog-title>Move file</md-dialog-title>
        <md-dialog-content style="overflow-y: auto;">
          <app-folder-tree
            ref="fileMoveFolderTree"
            :folders="store.folders"
            :initiallySelectedId="moveToFolderId"
            @folderSelected="selectFolderToMoveTo"
          ></app-folder-tree>
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click.native="closeDialog('fileMoveDialog')">Cancel</md-button>
          <md-button class="md-primary" type="submit">Ok</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>

    <md-dialog ref="fileDeleteDialog">
      <form @submit.prevent="deleteFile">
        <md-dialog-title>Delete file</md-dialog-title>
        <md-dialog-content>
          Are you sure you want to delete {{editingFile ? editingFile.name : 'this file'}}?
        </md-dialog-content>
        <md-dialog-actions>
          <md-button class="md-primary" @click.native="closeDialog('fileDeleteDialog')">No</md-button>
          <md-button class="md-primary" type="submit">Yes</md-button>
        </md-dialog-actions>
      </form>
    </md-dialog>

    <md-snackbar md-position="bottom center" ref="snackbar" md-duration="3000">
      <span>an Error occurred</span>
    </md-snackbar>

    <app-preview ref="filePreview"></app-preview>
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
        newFileName: '',
        moveToFolderId: null,
        uploadFormVisible: false,
        loadingError: false,
        editingFile: null
      }
    },
    computed: {
      userId () {return this.$store.state.account.user.id},
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
      downloadFile (file) {
        ajax({
          method: 'GET',
          url: config.API_DATA+'/file/'+file.id,
          headers: {
            'x-store-auth': this.$store.state.stores[this.storeid].password
          }
        })
        .then(res => {
          const link = config.API_UPLOAD+'/file/'+res.data.token+'/'+file.name+'?download=true'
          window.location.href = link
        })
        .catch(e => {})
      },
      openFile (file) {
        this.$refs['filePreview'].open(file, this.$store.state.stores[this.storeid].password)
      },
      openRenameFileDialog (file) {
        this.editingFile = file
        this.newFileName = file.name
        this.openDialog('fileRenameDialog')
      },
      renameFile () {
        this.$store.dispatch('stores/renameFile', {
          storeId: this.store.id,
          fileId: this.editingFile.id,
          newName: this.newFileName})
        .then (() => {
          this.$refs['fileRenameDialog'].close()
          this.fetchStore(true)
        })
        .catch(e => {
          this.newFolderName = ''
          this.$refs['fileRenameDialog'].close()
          this.$refs.snackbar.open()
        })
      },
      openMoveFileDialog (file) {
        this.editingFile = file
        this.openDialog('fileMoveDialog')
        this.moveToFolderId = this.editingFile.folderId
        this.$refs['fileMoveFolderTree'].reset()
      },
      selectFolderToMoveTo (folderId) {
        this.moveToFolderId = folderId
      },
      moveFile () {
        if (!this.moveToFolderId)
          return
        this.$store.dispatch('stores/moveFile', {
          storeId: this.store.id,
          fileId: this.editingFile.id,
          folderId: this.moveToFolderId})
        .then (() => {
          this.$refs['fileMoveDialog'].close()
          this.fetchStore(true)
        })
        .catch(e => {
          this.newFolderName = ''
          this.$refs['fileMoveDialog'].close()
          this.$refs.snackbar.open()
        })
      },
      openDeleteFileDialog (file) {
        this.editingFile = file
        this.openDialog('fileDeleteDialog')
      },
      deleteFile () {
        this.$store.dispatch('stores/deleteFile', {storeId: this.store.id, fileId: this.editingFile.id})
        this.$refs['fileDeleteDialog'].close()
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
