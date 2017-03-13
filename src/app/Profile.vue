<template lang="html">
  <div class="main-container">
    <app-toolbar title="Profile"></app-toolbar>
    <div class="content">
      <span class="md-display-1">{{user.name}}</span>
      <app-form title="edit Account" submit-btn-text="Save" @submit="submit">
        You only have to enter the information you want to change.<br>
        <md-input-container>
          <label>change E-Mail</label>
          <md-input type="email" v-model="email"></md-input>
        </md-input-container>
        Change password<br>
        <md-input-container>
          <label>old Password</label>
          <md-input type="password" v-model="passwordold"></md-input>
        </md-input-container>
        <small>If you don't know your old password, your userdata will be reset.</small>
        <app-pwuserdatainfo />
        <md-input-container md-has-password>
          <label>new Password</label>
          <md-input type="password" v-model="passwordnew"></md-input>
        </md-input-container>
      </app-form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        passwordnew: "",
        passwordold: "",
        email: this.$store.state.account.user.email
      }
    },
    computed: {
      user () {return this.$store.state.account.user}
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
