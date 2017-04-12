<template lang="html">
  <div>
    <md-toolbar md-theme="secondarybar">
      <div class="md-toolbar-container">
        <md-button class="md-icon-button" @click.native="$emit('close')">
          <md-icon>close</md-icon>
        </md-button>
        <h3 class="md-title">Store Settings</h3>
      </div>
    </md-toolbar>
    <div style="padding: 16px;" v-if="store">
      <form @submit.prevent="saveSettings" autocomplete="off">
        <md-input-container md-has-password>
          <label>Store Password</label>
          <md-input type="password" v-model="password" pattern=".{8,}" required></md-input>
        </md-input-container>
        <small>
          This will be the key to unlock your Store, so others will have it.
          Don't choose the same as your login password.
        </small>
        <hr>
        <md-radio v-model="store.access" name="access" md-value="0">invitations only</md-radio><br>
        <small>
          You have to invite users to the Store and they need the password.
        </small><br>
        <md-radio v-model="store.access" name="access" md-value="1">anyone with password</md-radio><br>
        <small>
          Everyone can access the Store with the Store password.
        </small><br>
        <md-radio v-model="store.access" name="access" md-value="2">anyone with password or access link</md-radio><br>
        <small>
          Everyone can access the Store with the password, plus you can give people an access link to the store
          for passwordless access.
        </small>
        <br>
        <md-button class="md-primary" @click.native="resetLink" v-if="store.access == 2">reset link</md-button>
        <p v-if="store.access == 2" style="word-wrap: break-word;">
          current Link:<br>
          <a href="http://google.com">cloudstudies.com/app.html#/app/store/{{store.id}}?l={{store.linkHash}}</a>
        </p>
        <hr>
        <md-button class="md-raised md-accent">save</md-button>
      </form>
      <h3>Members</h3>
      <p><small>
        Store members can access all files, tests and folders, create new tests and folders,
        and upload new files.
      </small></p>
      <fieldset>
        <legend>Add Member</legend>
        <form @submit.prevent="searchUser" autocomplete="off">
            <div class="combined-input">
              <md-input-container class="input">
                <label>Username</label>
                <md-input type="text" v-model="searchUsername" pattern=".{3,}" />
              </md-input-container>
              <div>
                <md-button class="md-icon-button focusfix" type="submit">
                  <md-icon>search</md-icon>
                </md-button>
              </div>
            </div>
        </form>
        <ul class="user-list">
          <li v-for="user in foundUsers" :key="user.id">
            <span class="username">{{user.name}}</span>
            <md-button class="btn-invite md-primary" @click.native="addUser(user)">add</md-button>
          </li>
        </ul>
      </fieldset>
      <ul class="user-list">
        <li v-for="user in store.members" :key="user.id">
          <span class="username">{{user.name}}</span>
          <md-button class="btn-action md-warn" @click.native="removeUser(user)" :disabled="user.id == $store.state.account.user.id">remove</md-button>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
  import axios from 'axios'

  import config from '../../config'

  export default {
    props: ['store'],
    data () {
      return {
        password: '',
        searchUsername: '',
        foundUsers: []
      }
    },
    methods: {
      searchUser () {
        axios.get(config.API_USERS + '/search', {
          params: {q: this.searchUsername},
          headers: {Authorization: this.$store.state.account.token}
        })
        .then(res => {
          this.foundUsers = res.data
        })
        .catch(() => {})
        this.searchUsername = ''
      },
      addUser (user) {
        this.$store.dispatch('stores/addMemberToStore', {id: this.store.id, user})
      },
      removeUser (user) {
        this.$store.dispatch('stores/removeMemberFromStore', {id: this.store.id, user})
      },
      saveSettings () {
        //new pw or access rules
      },
      resetLink () {
        this.$store.dispatch('stores/resetLink', {id: this.store.id})
      }
    }
  }
</script>

<style lang="scss" scoped>
  fieldset {
    border: 1px solid #aaa;
    legend {
      color: #444;
      font-size: 1rem;
    }
  }
  .user-list {
    list-style: none;
    padding: 0 4px;
    li {
      display: flex;
      flex-direction: row;
      align-items: center;
      margin: 0;
      border-top: 1px solid #ccc;
      &:first-child {
        border-top: none;
      }
      font-size: 1rem;
      .username {
        flex-grow: 1;
      }
      .btn-action {
        margin: 0;
      }
    }
  }
</style>
