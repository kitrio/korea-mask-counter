<template>
  <div id="app">
    <div id="nav">
      <a href="http://www.cdc.go.kr/">
        질병관리본부 바로가기
      </a>
    </div>
    <router-view />
  </div>
</template>

<style>
#app {
  font-family: Helvetica, Arial;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
}

#nav {
  padding: 10px;
}

#nav a {
  font-weight: bold;
  color: #2c3e50;
}
a { text-decoration:none }

</style>
