<template>
  <div class="corpo app">

    <router-view></router-view>

  </div>
</template>

<script>
export default {
  name: 'app',
  components: {
	//naviBarHeader
  },
  data () {
    return {
      msg: 'Welcome to Your Vue.js App'
    }
  }
}
</script>

<style>

  .corpo {
    font-family: Helvetica, sans-serif;
    margin: 0 auto;
    width: 100%;
    height: 100%;
  }
</style>