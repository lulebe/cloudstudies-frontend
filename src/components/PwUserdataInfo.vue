<template lang="html">
  <div>
    <md-button class="md-dense md-warn" id="btnOpenPwUserdataInfoDialog" @click.native="$refs.infoDialog.open()">more Information</md-button>
    <md-dialog md-open-from="#btnOpenPwUserdataInfoDialog" md-close-to="#btnOpenPwUserdataInfoDialog" ref="infoDialog">
      <md-dialog-title>Data removal</md-dialog-title>
      <md-dialog-content style="max-width: 600px;">
        <p>
          We still know which Stores you own, the files will be kept and others can still access
          them like before, but you'll need to re-enter the passwords for them, even if you decided
          to store those inside the app.
        </p>
        <dl>
          <dt><strong>What's lost</strong></dt>
          <dd>Stored passwords</dd>
          <dt><strong>What's kept</strong></dt>
          <dd>All Stores and files, tests and other data associated with them.</dd>
        </dl>
        <h4>Why?</h4>
        <p>
          Your password is encrypted before being stored on our server, so when you loose it,
          there is no way to decrypt information that was encrypted using that lost password.
          The Stored passwords as well as the information about which Stores you unlocked before
          is encrypted with that method, so that we have no way of decrypting it without you
          entering your password, so you'll have to unlock your Stores again using the Store's
          password.<br>
          All Stores have individual passwords, so their data will be kept, as well as ownership
          information about Stores you created and the files inside.
        </p>
      </md-dialog-content>
      <md-dialog-actions>
        <md-button @click.native="$refs.infoDialog.close()">Close</md-button>
      </md-dialog-actions>
    </md-dialog>
  </div>
</template>
