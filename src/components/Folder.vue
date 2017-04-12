<template>
  <div>
    <md-toolbar class="md-dense" md-theme="secondarybar">
      <md-button class="md-icon-button" v-if="!isroot" @click.native="$emit('goUp')">
        <md-icon>arrow_back</md-icon>
      </md-button>
      <h2 class="md-title">{{name}}</h2>
    </md-toolbar>
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
            <md-table-head>File</md-table-head>
            <md-table-head>Type</md-table-head>
            <md-table-head>Size</md-table-head>
            <md-table-head>Date</md-table-head>
          </md-table-row>
        </md-table-header>
        <md-table-body>
          <md-table-row v-for="file in filesFormatted" :key="file.id" @click.native="$emit('openfile', file)" class="filerow">
            <md-table-cell><div><md-icon>{{file.icon}}</md-icon> {{file.name}}</div></md-table-cell>
            <md-table-cell>{{file.type}}</md-table-cell>
            <md-table-cell>{{file.size}}</md-table-cell>
            <md-table-cell>{{file.date}}</md-table-cell>
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
  </div>
</template>

<script>
  import moment from 'moment'

  export default {
    props: [
      'name', 'isroot', 'folders', 'files'
    ],
    data () {
      return {
        fileview: 0
      }
    },
    computed: {
      filesFormatted () {
        return this.files.map(file => ({
          id: file.id,
          name: file.name,
          date: moment(file.createdAt).format('MMM Do YYYY'),
          size: formatSize(file.size),
          type: file.name.split('.').pop(),
          icon: getIconName(file.name.split('.').pop()),
        })).sort((a, b) => a.name.localeCompare(b.name))
      }
    }
  }

  function formatSize (byteSize) {
    let formatted = byteSize / 1000
    if (formatted < 1000)
      return Math.round(formatted) + ' KB'
    else
      return Math.round(formatted / 1000) + ' MB'
  }

  const imageExtensions = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'tiff']
  const audioExtensions = ['ogg', 'mp3', 'aac', 'flac', 'wav']
  const videoExtensions = ['mp4', '3gp', 'mp2']
  function getIconName (ext) {
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
  @media (max-width: 439px) {
   .file-grid .file {
      width: 100%;
    }
  }
  @media (min-width: 440px) {
    .file-grid .file {
      width: 46%;
    }
  }
  @media (min-width: 640px) {
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
  .filetable .filerow {
    cursor: pointer;
  }
  .md-table.filetable .md-table-head-text {
    padding-right: 0;
    padding-left: 12px;
  }
  .md-table.filetable .md-table-cell .md-table-cell-container {
    padding: 6px 0 6px 12px;
  }
</style>
