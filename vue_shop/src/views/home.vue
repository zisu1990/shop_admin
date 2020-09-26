<template>
  <el-container class="home-container">
    <!-- 头部区域 -->
    <el-header>
      <div class="header-left">
        <img src="@/assets/logo.png" alt srcset>
        <span>电商管理系统</span>
      </div>
      <el-button type="text" @click="logout">退出</el-button>
    </el-header>

    <!-- 页面主体区域 -->
    <el-container>
      <!-- 侧边栏 -->
      <el-aside :width="isCollapse?'64px':'200px'">
        <!-- 折叠菜单 -->
        <div class="toggle-button" @click="toggltBtn">|||</div>

        <!-- 导航菜单 -->
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#333744"
          text-color="#fff"
          active-text-color="#409eff"
          unique-opened
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          :default-active="activePath"
        >
          <!-- 一级菜单 -->
          <el-submenu :index="menu.id + ''" v-for="menu in menuList" :key="menu.id">
            <!-- 一级菜单模板区域 -->
            <template slot="title">
              <i :class="iconObj[menu.id]"></i>
              <span>{{menu.authName}}</span>
            </template>

            <!-- 二级菜单 -->
            <el-menu-item
              :index="'/'+menuChildren.path"
              v-for="menuChildren in menu.children"
              :key="menuChildren.id"
              @click="saveNavStatus('/'+menuChildren.path)"
            >
              <template slot="title">
                <i class="el-icon-menu"></i>
                <span>{{menuChildren.authName}}</span>
              </template>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>

      <!-- 右侧主体 -->
      <el-main>
        <!-- 面包屑导航区域 -->
        <el-breadcrumb separator="/">
          <el-breadcrumb-item :to="{ path:'/home' }">首页</el-breadcrumb-item>
          <el-breadcrumb-item>
            <a href="/">用户管理</a>
          </el-breadcrumb-item>
          <el-breadcrumb-item>用户列表</el-breadcrumb-item>
        </el-breadcrumb>
        <!-- 路由出口 -->
        <router-view/>
      </el-main>
    </el-container>
  </el-container>
</template>
<script>
export default {
  data() {
    return {
      menuList: [], //左侧菜单数据
      iconObj: {
        "125": "el-icon-user-solid",
        "103": "el-icon-warning",
        "101": "el-icon-s-goods",
        "102": "el-icon-success",
        "145": "el-icon-star-on"
      },
      isCollapse: false, //默认不折叠
      activePath: "" //被激活的链接地址
    };
  },
  created() {
    this.getMenuList();
    this.activePath = window.sessionStorage.getItem("path");
  },
  methods: {
    logout() {
      window.sessionStorage.clear(); //清除token
      this.$router.push("/login");
    },
    // 左侧菜单接口
    async getMenuList() {
      const res = await this.$http.get("menus");
      if (res.data.meta.status !== 200)
        return this.$message.error(res.data.meta.msg);
      this.menuList = res.data.data;
      console.log(this.menuList, "左侧菜单");
    },
    toggltBtn() {
      this.isCollapse = !this.isCollapse;
    },

    // 保存菜单链接的激活状态
    saveNavStatus(activePath) {
      window.sessionStorage.setItem("path", activePath),
        (this.activePath = activePath);
    }
  }
};
</script>

<style lang="less" scoped>
.home-container {
  height: 100%;
  .el-header {
    background: #333;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: 0;
    color: #fff;
    font-size: 20px;
    .header-left {
      display: flex;
      align-items: center;
      padding-left: 10px;
      img {
        width: 40px;
        height: 40px;
      }
      span {
        margin-left: 15px;
      }
    }
  }
  .el-aside {
    background: #333744;
    .el-menu {
      border-right: 0;
    }
    .toggle-button {
      background: #333744;
      font-size: 14px;
      color: #fff;
      line-height: 24px;
      text-align: center;
      cursor: pointer;
    }
  }
  .el-main {
    background: #eee;
  }
}
</style>
