<template>
  <div>
    <router-view class="main-router-view"></router-view>
    <footer>
      <div class="copyright">© Leander Berg 2017</div>
      <div class="links">
        <a class="footerlink" href="/imprint.html">Imprint</a>
        <a class="footerlink" href="https://github.com/lulebe/cloudstudies-frontend" target="_blank">Github Project</a>
      </div>
    </footer>
  </div>
</template>

<style lang="scss">
  .main-router-view {
    min-height: 100vh;
    overflow-x: hidden;
    display: flex;
    flex-direction: column;
  }
  footer {
    width: 100%;
    height: 120px;
    background: #333;
    color: white;
    padding: 24px 48px 0 48px;
  }
  footer .copyright {
    text-align: center;
    margin-bottom: 10px;
  }
  footer .links {
    display: flex;
    justify-content: space-around;
  }
  footer .links a.footerlink {
    color: #bbb;
    font-size: 100%;
  }
  footer .links a.footerlink:hover {
    color: #fff;
  }
  .md-button.focusfix:focus {
    box-shadow: 0 0 10px rgba(0,0,0,0.2);
  }
</style>
