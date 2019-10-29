<template>
  <div id="app">
    <!-- ここにヘッダーを表示する -->
    <common-header />
    <!--img src="./assets/logo.png"-->
    <router-view/>
  </div>
</template>

<script>
// コンポーネントを利用できるようにインポートする
import commonHeader from '@/components/CommonHeader'

export default {
  name: 'App',
  components : {
    'commonHeader': commonHeader
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
