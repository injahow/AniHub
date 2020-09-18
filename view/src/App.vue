<template>
  <div id="app">
    <div class="header">
      <el-menu :default-active="this.$route.path" mode="horizontal" router @select="handleSelect">
        <el-menu-item index="/">
          <i class="el-icon-s-home"></i>首页
        </el-menu-item>

        <el-menu-item index="/anime">
          <i class="el-icon-document"></i>动漫
        </el-menu-item>

        <el-menu-item index="/user" router="user">
          <i class="el-icon-user-solid"></i>用户
        </el-menu-item>

        <el-menu-item index="/about">
          <i class="el-icon-info"></i>关于
        </el-menu-item>
      </el-menu>
    </div>

    <router-view style="text-align: left;" v-if="isRouterAlive" />
  </div>
</template>

<script>
export default {
  name: "App",
  provide() {
    return {
      reload: this.reload,
    };
  },
  data() {
    return {
      isRouterAlive: true,
    };
  },
  mounted() {
    window.onresize = () => {
      this.screenWidth = document.body.clientWidth;
    };
  },
  methods: {
    reload() {
      this.isRouterAlive = false;
      this.$nextTick(() => {
        this.isRouterAlive = true;
      });
    },
    handleSelect(key, keyPath) {
      //console.log(key, keyPath);
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
}
</style>
