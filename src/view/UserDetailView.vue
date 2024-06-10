<template>
  <el-form ref="LoginRefForm" :model="userDetail" label-width="auto" label-position="left">
    <el-form-item label="【ID】">
      <el-input disabled v-model="userDetail.id"/>
    </el-form-item>

    <el-form-item label="【账号】">
      <el-input disabled placeholder="暂无" v-model="userDetail.loginAct"/>
    </el-form-item>

    <el-form-item label="【密码】">
      <el-input disabled placeholder="想看密码？你也配" />
    </el-form-item>

    <el-form-item label="【姓名】">
      <el-input disabled placeholder="暂无" v-model="userDetail.name"/>
    </el-form-item>

    <el-form-item label="【手机】">
      <el-input disabled placeholder="暂无" v-model="userDetail.phone"/>
    </el-form-item>

    <el-form-item label="【邮箱】">
      <el-input disabled placeholder="暂无" v-model="userDetail.email"/>
    </el-form-item>

    <el-form-item label="【账号过期状态】">
      <el-input disabled placeholder="暂无" :value="userDetail.accountNoExpired === 1 ? '正常':'已过期' "/>
    </el-form-item>

    <el-form-item label="【密码过期状态】">
      <el-input disabled placeholder="暂无" :value="userDetail.credentialsNoExpired === 1 ? '正常':'已过期' "/>
    </el-form-item>

    <el-form-item label="【账号锁定状态】">
      <el-input disabled placeholder="暂无" :value="userDetail.accountNoLocked === 1 ? '正常':'已锁定' "/>
    </el-form-item>

    <el-form-item label="【账号启用状态】">
      <el-input disabled placeholder="暂无" :value="userDetail.accountEnabled === 1 ? '正常':'禁用' "/>
    </el-form-item>

    <el-form-item label="【创建时间】">
      <el-input disabled placeholder="暂无" v-model="userDetail.createTime"/>
    </el-form-item>

    <el-form-item label="【创建人】">
      <el-input disabled placeholder="暂无" v-model="userDetail.createByDO.name"/>
    </el-form-item>

    <el-form-item label="【编辑时间】">
      <el-input disabled placeholder="暂无" v-model="userDetail.editTime"/>
    </el-form-item>

    <el-form-item label="【编辑人】">
      <el-input disabled placeholder="暂无" v-model="userDetail.editByDO.name"/>
    </el-form-item>

    <el-form-item label="【上次登录时间】">
      <el-input disabled placeholder="暂无" v-model="userDetail.lastLoginTime"/>
    </el-form-item>

    <el-button type="primary" @click="goBack">返回</el-button>
  </el-form>

</template>

<script>
import {doGet} from "../http/httpRequest.js";

export default {
  name: "UserDetailView",

  data() {
    return {
      userDetail: {
        createByDO:{},
        editByDO:{},
      },
    }
  },

  mounted() {
    this.loadUserDetail();
  },

  methods: {
    //加载用户详情
    loadUserDetail() {
      //params.id的id要和动态路由里设置的id名称相同
      let id = this.$route.params.id;
      doGet("/api/user/" + id, {}).then(resp => {
        if (resp.data.code === 200) {
          // console.log(resp);
          this.userDetail = resp.data.data;
          if (!this.userDetail.createByDO){
            this.userDetail.createByDO={};
          }
          if (!this.userDetail.editByDO){
            this.userDetail.editByDO={};
          }
        }
      })
    },

    //返回用户管理页
    goBack(){
      // window.location.href="/dashboard/user";
      this.$router.go(-1);
    },

  },

}
</script>

<style scoped>
.el-form {
  margin-top: 30px;
  margin-left: 30px;
}

.el-form-item{
  margin-top: 15px;
}

.el-input{
  margin-left: 30px;
  width: 80%;
}

.el-button{
  margin-top: 20px;
}
</style>