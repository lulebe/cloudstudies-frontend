<template lang="html">
  <div class="content">
    <md-button class="md-icon-button" @click.native="$router.go(-1)">
      <md-icon>close</md-icon>
    </md-button>
    <app-form title="Create a Test" submit-btn-text="Create" @submit="submit">
      <md-input-container>
        <label>Name</label>
        <md-input type="text" v-model="name" required></md-input>
      </md-input-container>
      <hr>
      Who can add and edit Questions?<br>
      <md-radio v-model="access" name="access" md-value="0">only you</md-radio><br>
      <small>
        This means we have to link your account with this test.
        Others still can't see that you created this, but everyone with access to our internal database can.
      </small><br>
      <md-radio v-model="access" name="access" md-value="1">everyone who can upload to this store</md-radio><br>
      <small>
        In this case we won't link your account with this test.
      </small>
      <hr>
    </app-form>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        access: 0,
        name: ''
      }
    },
    methods: {
      submit () {

      }
    }
  }
</script>

<style lang="scss">

</style>
