<template lang="html">
    <div class="main-container">
      <app-toolbar title="Store"></app-toolbar>
      <div class="content">
        <span class="md-subheading">Folders</span>
        <div class="folder-list">
          <md-button class="folder md-raised">
            <md-icon>folder</md-icon>
            Foldername
          </md-button>
          <md-button class="folder md-raised">
            <md-icon>folder</md-icon>
            Foldername
          </md-button>
          <md-button class="folder md-raised">
            <md-icon>folder</md-icon>
            Foldername
          </md-button>
          <md-button class="folder md-raised">
            <md-icon>folder</md-icon>
            Foldername
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
        <md-table v-once class="filetable" v-if="fileview==0">
          <md-table-header>
            <md-table-row>
              <md-table-head>File</md-table-head>
              <md-table-head>Type</md-table-head>
              <md-table-head>Size</md-table-head>
              <md-table-head>Date</md-table-head>
            </md-table-row>
          </md-table-header>

          <md-table-body>
            <md-table-row>
              <md-table-cell><div><md-icon>insert_drive_file</md-icon> Filename.pdf</div></md-table-cell>
              <md-table-cell>PDF</md-table-cell>
              <md-table-cell>16,7MB</md-table-cell>
              <md-table-cell>15.02.2012</md-table-cell>
            </md-table-row>
            <md-table-row>
              <md-table-cell><div><md-icon>image</md-icon> Filename.png</div></md-table-cell>
              <md-table-cell>PNG</md-table-cell>
              <md-table-cell>1,2MB</md-table-cell>
              <md-table-cell>15.02.2012</md-table-cell>
            </md-table-row>
          </md-table-body>
        </md-table>
        <div class="folder-list" v-if="fileview==1">
          <md-whiteframe md-tag="button" class="file attention">
            <md-ink-ripple />
            <div style="display: flex;">
              <div style="border-right: 1px solid #aaa; padding-right: 4px;">
                <md-icon class="fileicon">insert_drive_file</md-icon><br>
                <span class="md-caption filesize">16,7MB</span>
              </div>
              <div style="padding-left: 4px;">
                <span class="md-body-2">Filename.pdf</span><br>
                <span class="md-caption filedate">PDF 15.02.2012</span>
              </div>
            </div>
          </md-whiteframe>
          <md-whiteframe md-tag="button" class="file">
            <md-ink-ripple />
            <div style="display: flex;">
              <div style="border-right: 1px solid #aaa; padding-right: 4px;">
                <md-icon class="fileicon">image</md-icon><br>
                <span class="md-caption filesize">1,2MB</span>
              </div>
              <div style="padding-left: 4px;">
                <span class="md-body-2">Filename.png</span><br>
                <span class="md-caption filedate">15.02.2012</span>
              </div>
            </div>
          </md-whiteframe>
        </div>
      </div>
      <md-button class="md-fab fab"><md-icon>add</md-icon></md-button>
    </div>
</template>

<script>
  export default {
    props: [
      'storeid'
    ],
    data () {
      return {
        fileview: 0
      }
    },
    methods: {

    }
  }
</script>

<style lang="scss">
  .main-container {
    position: relative;
  }
  .fab {
    position: absolute;
    right: 16px;
    bottom: 16px;
  }
  .folder-list {
    display: flex;
    flex-wrap: wrap;
  }
  .folder {
    position: relative;
    padding: 8px 12px;
    display: inline-block;
    color: #a66;
    flex-grow: 1;
  }
  @media (max-width: 439px) {
    .file {
      width: 100%;
    }
  }
  @media (min-width: 440px) {
    .file {
      width: 46%;
    }
  }
  @media (min-width: 640px) {
    .file {
      width: 30%;
    }
  }
  .file {
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
  .md-table.filetable .md-table-head-text {
    padding-right: 0;
    padding-left: 12px;
  }
  .md-table.filetable .md-table-cell .md-table-cell-container {
    padding: 6px 0 6px 12px;
  }
</style>
