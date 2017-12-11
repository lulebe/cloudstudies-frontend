<template>
  <div class="content">
    <span class="md-subheading">Folders</span><br>
    <span class="md-caption" v-if="!folders || folders.length==0">No folders<br><br></span>
    <div class="folder-grid" v-if="folders && folders.length>0">
      <md-button v-for="folder in folders" :key="folder.id" class="folder md-raised" @click.native="$emit('openfolder', folder)">
        <md-icon>folder</md-icon>
        {{folder.shortname}}
      </md-button>
    </div>
    <span class="md-subheading">Files</span><br>
    <span class="md-caption" v-if="!files || files.length==0">No files</span>
    <md-button-toggle md-single v-if="files && files.length>0">
      <md-button class="md-icon-button md-toggle" @click.native="fileview = 0">
        <md-icon>view_list</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click.native="fileview = 1">
        <md-icon>view_module</md-icon>
      </md-button>
    </md-button-toggle>

    <md-table class="filetable" v-if="fileview==0 && files && files.length>0">
      <md-table-header>
        <md-table-row>
          <md-table-head @click.native="setSort('name')" :class="{sorted: sortBy == 'name'}">
            File
            <md-icon v-if="sortBy != 'name'" style="opacity: 0">arrow_downward</md-icon>
            <md-icon v-if="sortBy == 'name' && !sortReverse">arrow_downward</md-icon>
            <md-icon v-if="sortBy == 'name' && sortReverse">arrow_upward</md-icon>
            </md-table-head>
          <md-table-head @click.native="setSort('type')" :class="{sorted: sortBy == 'type'}">
            Type
            <md-icon v-if="sortBy != 'type'" style="opacity: 0">arrow_downward</md-icon>
            <md-icon v-if="sortBy == 'type' && !sortReverse">arrow_downward</md-icon>
            <md-icon v-if="sortBy == 'type' && sortReverse">arrow_upward</md-icon>
            </md-table-head>
          <md-table-head @click.native="setSort('size')" :class="{sorted: sortBy == 'size'}">
            Size
            <md-icon v-if="sortBy != 'size'" style="opacity: 0">arrow_downward</md-icon>
            <md-icon v-if="sortBy == 'size' && !sortReverse">arrow_downward</md-icon>
            <md-icon v-if="sortBy == 'size' && sortReverse">arrow_upward</md-icon>
            </md-table-head>
          <md-table-head @click.native="setSort('date')" :class="{sorted: sortBy == 'date'}">
            Date
            <md-icon v-if="sortBy != 'date'" style="opacity: 0">arrow_downward</md-icon>
            <md-icon v-if="sortBy == 'date' && !sortReverse">arrow_downward</md-icon>
            <md-icon v-if="sortBy == 'date' && sortReverse">arrow_upward</md-icon>
            </md-table-head>
          <md-table-head style="max-width: 48px"></md-table-head>
        </md-table-row>
      </md-table-header>
      <md-table-body>
        <md-table-row v-for="file in filesFormatted" :key="file.id">
          <md-table-cell @click.native="$emit('openfile', file)" class="filenamecell"><div><md-icon>{{file.icon}}</md-icon> {{file.name}}</div></md-table-cell>
          <md-table-cell>{{file.type}}</md-table-cell>
          <md-table-cell>{{file.size | fileSize}}</md-table-cell>
          <md-table-cell>{{file.date}}</md-table-cell>
          <md-table-cell class="cell-file-menu">
            <md-menu md-direction="top left" md-size="3">
              <md-button class="md-icon-button" md-menu-trigger>
                <md-icon>more_horiz</md-icon>
              </md-button>
              <md-menu-content>
                <md-menu-item @selected="$emit('renamefile', file)">
                  <md-icon>mode_edit</md-icon>
                  <span>rename</span>
                </md-menu-item>
                <md-menu-item @selected="$emit('movefile', file)">
                  <md-icon>folder_open</md-icon>
                  <span>move</span>
                </md-menu-item>
                <md-menu-item @selected="$emit('deletefile', file)">
                  <md-icon>delete</md-icon>
                  <span>delete</span>
                </md-menu-item>
              </md-menu-content>
            </md-menu>
          </md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

    <div class="file-grid" v-if="fileview==1 && files && files.length>0">
      <md-whiteframe v-for="file in filesFormatted" :key="file.id" md-tag="button" class="file attention" @click.native="$emit('openfile', file)">
        <md-ink-ripple />
        <div style="display: flex;">
          <div style="border-right: 1px solid #aaa; padding-right: 4px;">
            <md-icon class="fileicon">{{file.icon}}</md-icon><br>
            <span class="md-caption filesize">{{file.size}}</span>
          </div>
          <div style="padding-left: 4px; text-align: left;">
            <span class="md-body-2">{{file.name}}</span><br>
            <span class="md-caption filedate">{{file.type}} {{file.date}}</span>
          </div>
        </div>
      </md-whiteframe>
    </div>
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    props: [
      'folders', 'files', 'canDelete'
    ],
    data () {
      return {
        fileview: 0,
        sortBy: 'name',
        sortReverse: false
      }
    },
    computed: {
      filesFormatted () {
        const items = this.files.sort((a, b) => sortFiles(this.sortBy, a, b)).map(file => ({
          id: file.id,
          folderId: file.folderId,
          name: file.name,
          date: moment(file.createdAt).format('MMM Do YYYY'),
          size: file.size,
          type: file.name.split('.').pop(),
          icon: getIconName(file.name.split('.').pop()),
        }))
        if (this.sortReverse)
          return items.reverse()
        return items
      }
    },
    methods: {
      setSort (column) {
        if (column == this.sortBy)
          this.sortReverse = !this.sortReverse
        else
          this.sortReverse = false
        this.sortBy = column
      }
    }
  }

  function sortFiles(sortBy, a, b) {
    if (sortBy == 'name')
      return a.name.localeCompare(b.name)
    if (sortBy == 'date')
      return a.createdAt.localeCompare(b.createdAt)
    if (sortBy == 'size')
      return b.size - a.size
    if (sortBy == 'type')
      return a.name.split('.').pop().localeCompare(b.name.split('.').pop())
    return 0;
  }

  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff']
  const audioExtensions = ['ogg', 'mp3', 'aac', 'flac', 'wav', 'm4a']
  const videoExtensions = ['mp4', '3gp', 'mp2']
  function getIconName (extension) {
    const ext = extension.toLowerCase()
    if (ext == 'pdf')
      return 'picture_as_pdf'
    if (imageExtensions.indexOf(ext) > -1)
      return 'photo'
    if (audioExtensions.indexOf(ext) > -1)
      return 'audiotrack'
    if (videoExtensions.indexOf(ext) > -1)
      return 'movie'
    return 'insert_drive_file'
  }
</script>

<style lang="scss">
  .folder-grid, .file-grid {
    display: flex;
    flex-wrap: wrap;
  }
  .folder-grid .folder {
    padding: 6px 16px;
    text-transform: none;
  }
  @media (max-width: 479px) {
   .file-grid .file {
      width: 100%;
    }
  }
  @media (min-width: 480px) {
    .file-grid .file {
      width: 46%;
    }
  }
  @media (min-width: 600px) {
    .file-grid .file {
      width: 100%;
    }
  }
  @media (min-width: 720px) {
    .file-grid .file {
      width: 46%;
    }
  }
  @media (min-width: 960px) {
    .file-grid .file {
      width: 30%;
    }
  }
  .file-grid .file {
    background: white;
    border: none;
    padding: 8px;
    position: relative;
    margin: 8px;
    .fileicon {
      color: grey;
    }
    &.attention .fileicon {
      color: black;
    }
    .badge {
      color: red;
      position: absolute;
      top: -12px;
      right: -12px;
      z-index: 1;
    }
  }
  .filetable .filenamecell {
    cursor: pointer;
  }
  .filetable .filenamecell:hover {
    text-decoration: underline;
  }
  .md-table.filetable .md-table-head-text {
    padding-right: 0;
    padding-left: 12px;
  }
  .md-table.filetable .md-table-cell .md-table-cell-container {
    padding: 6px 0 6px 12px;
  }
  .md-table.filetable .md-table-head {
    cursor: pointer;
  }
  .md-table.filetable .md-table-head:hover {
    text-decoration: underline;
  }
  .md-table.filetable .md-table-head.sorted {
    color: black;
    text-decoration: underline;
  }
  .md-table .md-table-cell .md-button.md-icon-button .md-icon {
    font-size: 24px;
    margin: auto;
    width: 24px;
    min-width: 24px;
    height: 24px;
    min-height: 24px;
  }
</style>
