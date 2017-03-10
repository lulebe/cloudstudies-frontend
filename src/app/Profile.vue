<template lang="html">
  <div class="main-container">
    <app-toolbar title="Profile"></app-toolbar>
    <div class="content">
      <span class="md-display-1">{{user.name}}</span>
      <app-form title="edit Account" submit-btn-text="Save" @submit="submit">
        <md-input-container>
          <label>change E-Mail</label>
          <md-input type="email" v-model="email"></md-input>
        </md-input-container>
        <md-input-container md-has-password>
          <label>change Password</label>
          <md-input type="password" v-model="password"></md-input>
        </md-input-container>
      </app-form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        password: "",
        email: this.$store.state.user.email
      }
    },
    computed: {
      user () {return this.$store.state.user}
    },
    methods: {
      submit () {
        //1. PUT users.api.cloudstudies.de/
        //if pw changed:
        //2. GET userdata.api.cloudstudies.de =>
        //3. decrypt with old password
        //4. upload with new password
      }
    }
  }
</script>

  <style lang="scss">
</style>
