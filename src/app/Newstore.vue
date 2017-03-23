<template lang="html">
  <div class="main-container">
    <app-toolbar title="Create new Store"></app-toolbar>
    <div class="content">
      <span class="md-display-1"></span>
      <app-form title="Options" submit-btn-text="Create" @submit="submit">
        <md-input-container>
          <label>Store name</label>
          <md-input type="text" v-model="name" required></md-input>
        </md-input-container>
        <md-input-container md-has-password>
          <label>Store Password</label>
          <md-input type="password" v-model="password" pattern=".{8,}" required></md-input>
        </md-input-container>
        <small>
          This will be the key to unlock your Store, so others will have it.
          Don't choose the same as your login password.
        </small>
        <hr>
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
        </small>
        <hr>
      </app-form>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  import config from '../config'
  import pwhash from '../helpers/pwhash'

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
        const name = this.name
        const password = this.password
        const access = this.access
        if (name.length === 0 || password.length < 8) return
        axios.post(config.API_DATA + '/stores', {
          name,
          password: pwhash(password),
          access
        }, {
          headers: {
            Authorization: this.$store.state.account.token
          }
        })
        .then(res => {
          this.$router.push('/app/store/'+res.data.id)
        })
        .catch(e => {})
      }
    }
  }
</script>

<style lang="scss">
</style>
