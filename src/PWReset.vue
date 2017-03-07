<template>
  <div>
    <md-toolbar>
      <router-link tag="h1" class="md-title" to="/">Cloud Studies</router-link>
    </md-toolbar>
    <div class="reset">
      <h2>Password Reset</h2>
      <p>We will send a new password to your E-Mail address.
        This will only work if you provided an address during sign up.</p>
      <form>
        <md-input-container>
          <label>E-Mail</label>
          <md-input type="email" v-model="email" required></md-input>
        </md-input-container>
        <md-button @click.native="$router.push('/')">back</md-button>
        <md-button class="md-accent md-raised md-focusfix btn-reset" type="submit">reset</md-button>
      </form>
    </div>
  </div>
</template>

<script>
  export default {
    data () {
      return {
        email: ''
      }
    }
  }
</script>

<style lang="scss" scoped>
  .md-title:hover {
    cursor: pointer;
    color: white;
    text-shadow: 0 0 5px rgba(0,0,0,0.2);
    transform: translateY(-1px);
  }
  .md-title:active {
    transform: translateY(0px);
  }
  .reset {
    margin: 0 auto;
    padding: 24px;
    max-width: 400px;
  }
  .btn-back {
    float: left;
  }
  .btn-reset {
    float: right;
  }
</style>
