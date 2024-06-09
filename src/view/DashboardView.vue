<template>
  <el-container>
    <!-- 左侧 -->
    <el-aside :width="isCollapse ? '64px' : '200px'">
      <div class="menuTitle" @click="home">莓酉科技管理系统</div>
      <el-menu
          active-text-color="#ffd04b"
          background-color="#334157"
          class="el-menu-vertical-demo"
          default-active="2"
          text-color="#fff"
          :collapse="isCollapse"
          :collapse-transition="false"
          :router="true"
          style="border-right: solid 0px"
          @open="handleOpen"
          @close="handleClose"
      >

        <!-- 市场活动 -->
        <el-sub-menu index="1">
          <template #title>
            <el-icon>
              <Shop/>
            </el-icon>
            <span>市场活动</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="1-1">
              <el-icon>
                <Shop/>
              </el-icon>
              市场活动
            </el-menu-item>
            <el-menu-item index="1-2">
              <el-icon>
                <Histogram/>
              </el-icon>
              市场统计
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 线索管理 -->
        <el-sub-menu index="2">
          <template #title>
            <el-icon>
              <Search/>
            </el-icon>
            <span>线索管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="2-1">
              <el-icon>
                <Search/>
              </el-icon>
              线索管理
            </el-menu-item>
            <el-menu-item index="2-2">
              <el-icon>
                <Histogram/>
              </el-icon>
              线索统计
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 客户管理 -->
        <el-sub-menu index="3">
          <template #title>
            <el-icon>
              <Phone/>
            </el-icon>
            <span>客户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="3-1">
              <el-icon>
                <Phone/>
              </el-icon>
              客户管理
            </el-menu-item>
            <el-menu-item index="3-2">
              <el-icon>
                <Histogram/>
              </el-icon>
              客户统计
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 交易管理 -->
        <el-sub-menu index="4">
          <template #title>
            <el-icon>
              <Wallet/>
            </el-icon>
            <span>交易管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="4-1">
              <el-icon>
                <Wallet/>
              </el-icon>
              交易管理
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 产品管理 -->
        <el-sub-menu index="5">
          <template #title>
            <el-icon>
              <Box/>
            </el-icon>
            <span>产品管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="5-1">
              <el-icon>
                <Box/>
              </el-icon>
              产品管理
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 字典管理 -->
        <el-sub-menu index="6">
          <template #title>
            <el-icon>
              <Key/>
            </el-icon>
            <span>字典管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="6-1">
              <el-icon>
                <Key/>
              </el-icon>
              字典管理
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 用户管理 -->
        <el-sub-menu index="7">
          <template #title>
            <el-icon>
              <User/>
            </el-icon>
            <span>用户管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="/dashboard/user">
              <el-icon>
                <User/>
              </el-icon>
              用户管理
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

        <!-- 系统管理 -->
        <el-sub-menu index="8">
          <template #title>
            <el-icon>
              <Setting/>
            </el-icon>
            <span>系统管理</span>
          </template>
          <el-menu-item-group>
            <el-menu-item index="8-1">
              <el-icon>
                <Setting/>
              </el-icon>
              系统管理
            </el-menu-item>
          </el-menu-item-group>
        </el-sub-menu>

      </el-menu>
    </el-aside>

    <!-- 右侧 -->
    <el-container class="rightContent">
      <!-- 上侧 -->
      <el-header>
        <!-- 菜单左右折叠按钮 -->
        <el-icon class="show" @click="showMenu">
          <Fold/>
        </el-icon>

        <el-dropdown :hide-on-click="false">
          <span class="el-dropdown-link">{{ user.name }}<el-icon class="el-icon--right"><arrow-down/></el-icon></span>
          <template #dropdown>
            <el-dropdown-menu>
              <el-dropdown-item>我的资料</el-dropdown-item>
              <el-dropdown-item>修改密码</el-dropdown-item>
              <el-dropdown-item divided @click="logout">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </template>
        </el-dropdown>
      </el-header>

      <!-- 中间 -->
      <el-main>
        <!--渲染子路由-->
        <router-view v-if="isRouterAlive"/>
      </el-main>

      <!-- 下侧 -->
      <el-footer>Copyright ©2024 版权所有：浙江莓酉豆豆龙科技有限公司  <el-link href="https://github.com/doudoulongdoudou" target="_blank">关于我</el-link>  网站备案/许可证号：浙ICP备 114514号-1
      </el-footer>

    </el-container>
  </el-container>

</template>

<script>
import {doGet, doPost} from "../http/httpRequest.js";
import {messageConfirm, messageTip, removeToken} from "../util/util.js";
import UserManagerView from "./UserView.vue";

export default {
  name: "DashboardView",
  components: {UserManagerView},

  data() {
    return {
      //控制左侧菜单是否展开折叠，true为折叠
      isCollapse: false,
      //登录用户对象,初始为空
      user: {},
      //控制仪表盘右侧页面内容是否显示,默认是true显示
      isRouterAlive: true
    }
  },

  //提供者
  provide() {
    return {
      //提供一个函数，要求是箭头函数
      reload: () => {
        this.isRouterAlive = false;
        this.$nextTick(function () {
          this.isRouterAlive= true;
        })
      },

    }
  },

  //函数钩子
  mounted() {
    //加载当前登录用户
    this.loadLoginUser();
  },

  methods: {
    //左侧菜单左右展开折叠
    showMenu() {
      this.isCollapse = !this.isCollapse;
    },

    //加载登录用户信息
    loadLoginUser() {
      doGet("/api/login/info", {}).then((resp) => {
        // console.log(resp);
        this.user = resp.data.data;
      })
    },

    //退出登录
    logout() {
      doGet("/api/logout", {}).then((resp) => {
        if (resp.data.code === 200) {
          //清除前端的token
          removeToken();
          messageTip("登出成功", "success");
          //跳转登录页
          window.location.href = "/";
        } else {
          //强行退出登录
          messageConfirm('登出异常，是否强制登出？')
              //点击确定触发then()
              .then(() => {
                removeToken();
                //跳转登录页
                window.location.href = "/";
              })
              //点击取消触发catch()
              .catch(() => {
                messageTip("取消强制登出", "warning")
              })
        }
      })
    },

    //跳转首页
    home() {
      window.location.href = "/dashboard";
    },

  }
}
</script>

<style scoped>
.el-aside {
  background: #334157;
}

.el-header {
  background: #c6e2ff;
  height: 35px;
  line-height: 35px;
}

.el-footer {
  background: #c6e2ff;
  height: 35px;
  line-height: 35px;
  text-align: center;
}

.el-dropdown {
  line-height: 35px;
  float: right;
  cursor: pointer;
}

.rightContent {
  height: calc(100vh);
}

.menuTitle {
  height: 35px;
  line-height: 35px;
  text-align: center;
  font-weight: bold;
  color: #fff;
  cursor: pointer;
}

.show {
  cursor: pointer;
}


</style>