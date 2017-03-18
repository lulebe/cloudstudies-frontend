<template>
  <div class="content">
    <span class="md-subheading">Folders</span>
    <div class="folder-grid">
      <md-button v-for="folder in folders" v-key="folder.id" class="folder md-raised" @click.native="openFolder(folder)">
        <md-icon>folder</md-icon>
        {{folder.name}}
      </md-button>
    </div>
    <span class="md-subheading">Files</span>
    <md-button-toggle md-single>
      <md-button class="md-icon-button md-toggle" @click.native="fileview = 0">
        <md-icon>view_list</md-icon>
      </md-button>
      <md-button class="md-icon-button" @click.native="fileview = 1">
        <md-icon>view_module</md-icon>
      </md-button>
    </md-button-toggle>

    <md-table class="filetable" v-if="fileview==0">
      <md-table-header>
        <md-table-row>
          <md-table-head>File</md-table-head>
          <md-table-head>Type</md-table-head>
          <md-table-head>Size</md-table-head>
          <md-table-head>Date</md-table-head>
        </md-table-row>
      </md-table-header>
      <md-table-body>
        <md-table-row v-for="file in files" v-key="file.id" @click.native="openFile(file)" class="filerow">
          <md-table-cell><div><md-icon>insert_drive_file</md-icon> {{file.name}}</div></md-table-cell>
          <md-table-cell>{{file.type}}</md-table-cell>
          <md-table-cell>{{file.size}}</md-table-cell>
          <md-table-cell>{{file.date}}</md-table-cell>
        </md-table-row>
      </md-table-body>
    </md-table>

    <div class="file-grid" v-if="fileview==1">
      <md-whiteframe v-for="file in files" v-key="file.id" md-tag="button" class="file attention" @click.native="openFile(file)">
        <md-ink-ripple />
        <div style="display: flex;">
          <div style="border-right: 1px solid #aaa; padding-right: 4px;">
            <md-icon class="fileicon">insert_drive_file</md-icon><br>
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
  export default {
    data () {
      return {
        fileview: 0,
        folders: [
          {id: 1, name: 'some folder'},
          {id: 2, name: 'some other folder'}
        ],
        files: [
          {id: 1, name: 'Filename.pdf', type: 'PDF', size: '16.7MB', date: '12.02.2012'},
          {id: 2, name: 'Filename.png', type: 'PNG', size: '1.2MB', date: '10.02.2012'},
          {id: 3, name: 'Filename.jpeg', type: 'JPEG', size: '1.2MB', date: '10.02.2012'},
          {id: 4, name: 'some very long filename.png', type: 'PNG', size: '1.6MB', date: '10.02.2012'},
          {id: 5, name: 'something.docx', type: 'DOCX', size: '1.2MB', date: '10.02.2012'},
          {id: 6, name: 'something else.docx', type: 'DOCX', size: '1.8MB', date: '05.02.2012'},
          {id: 7, name: 'Filename.png', type: 'PNG', size: '1.2MB', date: '05.02.2012'},
          {id: 8, name: 'Filename.png', type: 'PNG', size: '1.1MB', date: '05.02.2012'},
          {id: 9, name: 'Filename.png', type: 'PNG', size: '1.1MB', date: '03.02.2012'},
          {id: 10, name: 'Filename.png', type: 'PNG', size: '0.2MB', date: '01.02.2012'}
        ]
      }
    },
    methods: {
      openFolder (folder) {
        alert(folder)
      },
      openFile (file) {
        alert(file)
      }
    }
  }
</script>

<style lang="scss">
  .folder-grid, .file-grid {
    display: flex;
    flex-wrap: wrap;
  }
  .folder-grid .folder {
    padding: 6px 16px;
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
