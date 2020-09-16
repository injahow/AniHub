<template>
  <div id="app">
    <h1 style="color: #409EEF;">Anime Hub</h1>
    <el-menu
      :default-active="activeIndex"
      class="el-menu-demo"
      mode="horizontal"
      @select="handleSelect"
    >
      <el-menu-item index="1">首页</el-menu-item>
      <el-submenu index="2">
        <template slot="title">用户</template>
      </el-submenu>
      <el-menu-item index="3">动漫</el-menu-item>
      <el-menu-item index="4">
        <a href="https://injahow.com" target="_blank">关于</a>
      </el-menu-item>
    </el-menu>
    <router-view />
  </div>
</template>

<script>
export default {
  data() {
    return {
      activeIndex: "1",
      activeIndex2: "1",
    };
  },
  methods: {
    handleSelect(key, keyPath) {
      console.log(key, keyPath);
    },
  },
};
</script>

<style>
#app {
  font-family: "Avenir", Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
