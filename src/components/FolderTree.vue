<template>
  <md-list class="md-dense md-double-line folder-tree">
    <md-list-item
    v-for="folder in orderedFolders"
    :key="folder.id"
    @click.native="selectFolder(folder.id)"
    :style="{paddingLeft: (12*folder.level+4)+'px'}"
    class="folder-item"
    :class="{selected: folder.id == selectedId}">
      <div class="md-list-text-container">
        <span>{{folder.shortname}}</span>
        <span v-if="folder.level > 0" class="fullpath">{{folder.name}}</span>
      </div>
    </md-list-item>
  </md-list>
</template>
<script>
export default {
  props: ['folders', 'initiallySelectedId'],
  data () {
    return {
      userSelectedId: null
    }
  },
  computed: {
    selectedId () {
      return this.userSelectedId || this.initiallySelectedId
    },
    orderedFolders () {
      const folders = this.folders.map(folder => ({
        id: folder.id,
        parentId: folder.parentId,
        name: folder.name,
        shortname: folder.name.replace(/.*\//, '') || '/',
        level: folder.name.split('/').filter(x => x.length>0).length
      })).sort((a,b) => a.name.localeCompare(b.name))
      return folders
    }
  },
  methods: {
    selectFolder (folderId) {
      this.$emit('folderSelected', folderId)
      this.userSelectedId = folderId
    },
    reset () {
      this.userSelectedId = null
    }
  }
}
</script>
<style lang="scss">
  .folder-tree .folder-item {
    padding: 4px;
    cursor: pointer;
    border-bottom: 1px solid lightgray;
  }
  .folder-tree .folder-item:last-child {
    border-bottom: none;
  }
  .folder-tree .folder-item.selected {
    background: rgba(0,0,0,0.1);
  }
  .folder-tree.md-list.md-double-line.md-dense .md-list-item .md-list-item-container {
    min-height: 36px;
    padding: 0;
  }
  .folder-tree .fullpath {
    font-size: 10px !important;
  }
</style>
