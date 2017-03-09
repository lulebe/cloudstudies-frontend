<template lang="html">
  <div class="main-container">
    <app-toolbar title="Create new Store"></app-toolbar>
    <div class="content">
      <span class="md-display-1"></span>
      <fieldset>
        <legend>Options</legend>
        <form v-on:submit.prevent="submit" autocomplete="off">
          <md-input-container>
            <label>Store name</label>
            <md-input type="text" v-model="name" required></md-input>
          </md-input-container>
          <md-input-container md-has-password>
            <label>Store Password</label>
            <md-input type="password" v-model="password" required></md-input>
          </md-input-container>
          <small>
            This will be the key to unlock your Store, so others will have it.
            Don't choose the same as your login password.
          </small><br>
          <md-radio v-model="access" name="access" md-value="0">invitations only</md-radio><br>
          <small>
            You have to invite users to the Store and they need the password.
          </small><br>
          <md-radio v-model="access" name="access" md-value="1">anyone with password</md-radio><br>
          <small>
            Everyone can access the Store with the Store password.
          </small><br>
          <md-radio v-model="access" name="access" md-value="2">anyone with password or access link</md-radio><br>
          <small>
            Everyone can access the Store with the password, plus you can give people an access link to the store
            for passwordless access.
          </small><br>
          <md-button class="md-accent md-raised md-focusfix" type="submit">Create</md-button>
        </form>
      </fieldset>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        name: "",
        password: "",
        access: 1
      }
    },
    methods: {
      submit () {
        alert(1)
      }
    }
  }
</script>

<style lang="scss" scoped>
  .content {
    padding: 16px;
  }
  fieldset {
    margin: 24px auto 0 auto;
    max-width: 400px;
    border: 1px solid #aaa;
    legend {
      color: #444;
      font-size: 1rem;
    }
  }
</style>
