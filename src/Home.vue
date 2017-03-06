<template>
  <div>
    <header>
      <h1>Cloud Studies</h1>
      <router-link to="/app"><md-button class="md-raised md-accent">Sign in</md-button></router-link>
    </header>
    <article>
      <h2>Advertisement</h2>
      <p>This will be filled with useless text.</p>
    </article>
    <footer>
      <div class="copyright">© Leander Berg 2017</div>
      <div class="links">
        <a href="#/imprint">Imprint</a>
        <a href="https://github.com/lulebe/cloudstudies-frontend" target="_blank">Github Project</a>
      </div>
    </footer>
  </div>
</template>

<style lang="scss" scoped>
  @media (min-width: 1025px) {
    h1 {
      font-size: 5rem;
    }
  }
  @media (max-width: 1024px) {
    h1 {
      font-size: 3rem;
    }
  }
  h1 {
    font-weight: 300;
    color: white;
    text-shadow: 5px 10px 25px rgba(0,0,0,1);
    margin-bottom: 100px;
    transition: font-size 0.2s ease-out;
  }
  header {
    height: 500px;
    background: #43a047;
    padding-top: 150px;
    text-align: center;
  }
  article {
    min-height: 500px;
    margin: 0 auto;
    max-width: 800px;
    padding: 24px
  }
  footer {
    background: #333;
    color: white;
    padding: 24px 48px 48px 48px;
    .copyright {
      text-align: center;
      margin-bottom: 10px;
    }
    .links {
      display: flex;
      justify-content: space-around;
      a {
        color: #bbb;
      }
    }
  }
</style>
