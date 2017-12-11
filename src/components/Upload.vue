<template>
  <div>
    <form enctype="multipart/form-data" novalidate>
      <div class="dropbox">
        <input type="file" multiple name="files" @change="filesChange($event.target.files)"
          accept="*/*" class="input-file">
          <p>
            Drag your file(s) here to begin<br> or click to browse
          </p>
      </div>
    </form>
  </div>
</template>
<script>
import uploads from '../helpers/uploads'

export default {
  props: ['headers', 'url'],
  data () {
    return {
    }
  },
  methods: {
    filesChange(fileList) {
      if (!fileList.length) return;
      Array
        .from(Array(fileList.length).keys())
        .map(x => {
          uploads.uploader.addUpload(fileList[x], this.url, this.headers)
        })
    }
  }
}
</script>
<style lang="scss" scoped>
  .dropbox {
    border: 2px dashed grey; /* the dash box */
    color: dimgray;
    padding: 10px 10px;
    min-height: 200px; /* minimum height */
    position: relative;
    cursor: pointer;
    text-align: center;
  }
  
  .input-file {
    opacity: 0; /* invisible but it's there! */
    width: 100%;
    height: 200px;
    position: absolute;
    cursor: pointer;
  }
  
  .dropbox p {
    font-size: 1.2em;
    text-align: center;
    padding: 50px 0;
  }
</style>
