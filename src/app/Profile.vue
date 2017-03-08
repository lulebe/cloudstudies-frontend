<template lang="html">
  <div class="main-container">
    <app-toolbar title="Profile"></app-toolbar>
    <div class="profile">
      <span class="md-display-1">{{user.name}}</span>
      <fieldset>
        <legend>edit account</legend>
        <form v-on:submit.prevent="submit">
          <md-input-container>
            <label>change E-Mail</label>
            <md-input type="text" v-model="email"></md-input>
          </md-input-container>
          <md-input-container>
            <label>change Password</label>
            <md-input type="password" v-model="password"></md-input>
          </md-input-container>
          <md-button class="md-accent md-raised md-focusfix" type="submit">Save</md-button>
        </form>
      </fieldset>
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

      }
    }
  }
</script>

  <style lang="scss" scoped>
  .profile {
    padding: 24px;
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
