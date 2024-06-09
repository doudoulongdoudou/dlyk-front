<template>

  <el-input
      v-model="input2"
      type="text"
      style="width: 240px"
      placeholder="请输入查询账号"
      :prefix-icon="Search"
  />
  <el-button plain class="topButton" @click="add" type="primary">添加用户</el-button>
  <el-button class="topButton" type="danger">批量删除</el-button>

  <el-table
      ref="multipleTableRef"
      :data="userList"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55"/>
    <el-table-column type="index" label="序号" width="55"/>
    <el-table-column property="loginAct" label="账号" show-overflow-tooltip/>
    <el-table-column property="name" label="姓名" show-overflow-tooltip/>
    <el-table-column property="phone" label="手机号" show-overflow-tooltip/>
    <el-table-column property="email" label="邮箱" show-overflow-tooltip/>
    <el-table-column property="lastLoginTime" label="上次登录" show-overflow-tooltip/>

    <!--操作-->
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button link type="primary" size="small" @click.prevent="view(scope.row.id)">详情</el-button>
        <el-button link type="primary" size="small" @click.prevent="edit(scope.row.id)">编辑</el-button>
        <el-button link type="primary" size="small" @click.prevent="del(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!--新增用户对话框 弹窗-->
  <el-dialog v-model="userDialogVisible" title="【新增用户】" width="700">
    <el-form class="userDialogForm" ref="userRefForm" :model="userQuery" label-width="auto" label-position="left"
             :rules="addUserRules">
      <el-form-item prop="loginAct" label="用户名">
        <el-input v-model="userQuery.loginAct" placeholder="用户名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="loginPwd" label="密码">
        <el-input type="password" v-model="userQuery.loginPwd" placeholder="密码" show-password></el-input>
      </el-form-item>
      <el-form-item prop="name" label="姓名">
        <el-input v-model="userQuery.name" placeholder="姓名" clearable></el-input>
      </el-form-item>
      <el-form-item prop="phone" label="手机">
        <el-input v-model="userQuery.phone" placeholder="手机" clearable></el-input>
      </el-form-item>
      <el-form-item prop="email" label="邮箱">
        <el-input v-model="userQuery.email" placeholder="邮箱" clearable></el-input>
      </el-form-item>

      <el-form-item prop="accountNoExpired" label="账号是否过期">
        <el-radio-group v-model="userQuery.accountNoExpired">
          <el-radio-button label="是" value="0"/>
          <el-radio-button label="否" value="1"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="credentialsNoExpired" label="密码是否过期">
        <el-radio-group v-model="userQuery.credentialsNoExpired">
          <el-radio-button label="是" value="0"/>
          <el-radio-button label="否" value="1"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="accountNoLocked" label="账号是否锁定">
        <el-radio-group v-model="userQuery.accountNoLocked">
          <el-radio-button label="是" value="0"/>
          <el-radio-button label="否" value="1"/>
        </el-radio-group>
      </el-form-item>
      <el-form-item prop="accountEnabled" label="账号是否启用">
        <el-radio-group v-model="userQuery.accountEnabled">
          <el-radio-button label="是" value="1"/>
          <el-radio-button label="否" value="0"/>
        </el-radio-group>
      </el-form-item>

    </el-form>

    <template #footer>
      <div class="dialog-footer">
        <el-button @click="userDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="userSubmit">提 交</el-button>
      </div>
    </template>
  </el-dialog>

  <el-pagination
      v-model:current-page="pageNum"
      :small="small"
      :disabled="disabled"
      :background="background"
      layout="total, prev, pager, next"
      :total="total"
      @current-change="handleCurrentChange"
  />

</template>

<script>
import {doGet, doPost} from "../http/httpRequest.js";
import {Search} from "@element-plus/icons-vue";
import {messageTip} from "../util/util.js";

export default {
  name: "UserView",

  //注入父页面的属性、函数
  inject:['reload'],

  computed: {
    Search() {
      return Search
    }
  },

  data() {
    return {
      userList: [
        {}
      ],
      //新增用户表单对象
      userQuery: {
        //账号密码相关状态 默认值
        accountNoExpired: 1,
        credentialsNoExpired: 1,
        accountNoLocked: 1,
        accountEnabled: 1,
      },
      //分页参数
      total: '',
      pageNum: '',
      //新增用户弹出对话框 true为弹出，false为不弹出
      userDialogVisible: false,
      //定义新增用户表单提交规则
      addUserRules: {
        //定义账号验证规则，规则可以有多个所以是数组
        loginAct: [
          {required: true, message: '请输入用户名', trigger: 'blur'}
        ],
        //定义密码验证规则
        loginPwd: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 6, max: 16, message: '密码长度为6-16位', trigger: 'blur'},
        ],
        //定义姓名规则
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'},
          {pattern: /^[\u4e00-\u9fa5]{0,}$/, message: '姓名必须是中文', trigger: 'blur'},
        ],
        //定义手机验证规则
        phone: [
          {required: true, message: '请输入手机号', trigger: 'blur'},
          {pattern: /^1[3-9]\d{9}$/, message: '手机号不合法', trigger: 'blur'},
        ],
        //定义邮箱验证规则
        email: [
          {required: true, message: '请输入邮箱地址', trigger: 'blur'},
          {type: 'email', message: '邮箱地址不合法', trigger: 'blur'},
        ],
      },

    }
  },

  mounted() {
    this.getUserList(1);
  },

  methods: {
    //勾选或者取消勾选时，触发该函数
    handleSelectionChange() {

    },

    //获取所有用户的信息   current 当前页
    getUserList(current) {
      doGet("/api/user/list", {current}).then((resp) => {
        if (resp.data.code === 200) {
          console.log(resp);
          this.userList = resp.data.data.list;
          this.pageNum = resp.data.data.pageNum;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },

    //分页函数-改变当前页
    handleCurrentChange(pageNum) {
      this.getUserList(pageNum);
    },

    //操作-查看详情
    view(id) {
      // console.log(id);
      //跳转路由
      this.$router.push("/dashboard/user/" + id);
    },

    //新增用户点击按钮  弹窗
    add() {
      this.userDialogVisible = true;
    },

    //新增用户  提交保存
    userSubmit() {
      //FormData就像java的map，一个key一个value,通过formData.append()来添加数据
      let formData = new FormData();
      //循环写入
      for (let field in this.userQuery) {
        formData.append(field, this.userQuery[field]);
      }

      this.$refs.userRefForm.validate((isValid) => {
        if (isValid) {
          doPost("/api/user", formData).then((resp) => {
            if (resp.data.code === 200) {
              console.log(resp);
              messageTip("提交成功", "success");
              //页面刷新
              this.reload();
            } else {
              messageTip("提交失败", "error");
            }
          })
        }
      })

      //关闭弹窗
      this.userDialogVisible=false;
    },

  },

}
</script>

<style scoped>
.el-table {
  height: 90%;
  width: 100%;
  margin-top: 20px;
}

.el-pagination {
  height: 5%;
}

.topButton {
  margin-left: 20px;
}

.userDialogForm {
  margin-top: 25px;
  margin-left: 30px;
  width: 70%;
}
</style>