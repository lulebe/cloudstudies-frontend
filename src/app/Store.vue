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

      <md-speed-dial class="fab" md-direction="bottom" v-if="store">
        <md-button class="md-fab" id="store-fab" md-fab-trigger>
          <md-icon md-icon-morph>close</md-icon>
          <md-icon>add</md-icon>
        </md-button>
        <md-button class="md-fab md-primary md-mini md-clean" @click.native="openDialog('folderCreationDialog')">
          <md-icon>create_new_folder</md-icon>
          <md-tooltip md-direction="left">Create folder</md-tooltip>
        </md-button>
        <md-button class="md-fab md-primary md-mini md-clean" @click.native="upload">
          <md-icon>cloud_upload</md-icon>
          <md-tooltip md-direction="left">Upload files</md-tooltip>
        </md-button>
      </md-speed-dial>

      <app-form title="Unlock Store" submitBtnText="unlock" v-if="!store" @submit="fetchStore">
        <md-input-container>
          <label>Store Password</label>
          <md-input type="password" v-model="password" />
        </md-input-container>
      </app-form>

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
      'storeid'
    ],
    data () {
      return {
        password: '',
        displayedFolderPath: '/',
        displaysRoot: true,
        newFolderName: ''
      }
    },
    computed: {
      store () {return this.$store.state.stores[this.storeid]},
      storename () {
        if (this.$store.state.stores[this.storeid])
          return this.$store.state.stores[this.storeid].name
        return 'Store'
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
          this.password = this.$store.state.account.userdata.stores[this.storeid].password
          this.fetchStore(true)
        }
      }
    },
    watch: {
      '$route' (to, from) {
        this.password = ''
        if (this.$store.state.account.userdata.stores) {
          if (this.$store.state.account.userdata.stores[this.storeid]) {
            this.password = this.$store.state.account.userdata.stores[this.storeid].password
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
      fetchStore (hashed) {
        this.$store.dispatch('stores/fetchStore', {id: this.storeid, password: this.password, pwhashed: hashed || false})
      },
      goUp () {
        if (this.displaysRoot) return
        this.displayedFolderPath = this.$store.state.stores[this.storeid].folders.filter(f =>
          f.id === this.displayedFolder.parentId
        )[0].name
        this.displaysRoot = this.displayedFolderPath == '/'
      },
      openFolder (folder) {
        this.displayedFolderPath = folder.name
        this.displaysRoot = false
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
      },
      upload () {
        alert('upload')
      }
    }
  }
</script>

<style lang="scss" scoped>
  .fab {
    position: absolute;
    right: 16px;
    top: 80px;
  }
</style>
