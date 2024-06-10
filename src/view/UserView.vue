<template>

  <el-input
      v-model="input2"
      type="text"
      style="width: 240px"
      placeholder="请输入查询账号"
      :prefix-icon="Search"
  />
  <el-button plain class="topButton" @click="add" type="primary">添加用户</el-button>
  <el-button class="topButton" type="danger" @click="batchDel">批量删除</el-button>

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
  <el-dialog v-model="userDialogVisible" :title="userQuery.id > 0 ? '【编辑用户】' : '【新增用户】'" width="700">
    <el-form class="userDialogForm" ref="userRefForm" :model="userQuery" label-width="auto" label-position="left"
             :rules="addUserRules">
      <el-form-item prop="loginAct" label="用户名">
        <el-input v-model="userQuery.loginAct" placeholder="用户名" clearable></el-input>
      </el-form-item>

      <!--编辑-->
      <el-form-item label="密码" v-if="userQuery.id > 0">
        <el-input type="password" v-model="userQuery.loginPwd" placeholder="不修改默认使用原密码"
                  show-password></el-input>
      </el-form-item>
      <!--新增-->
      <el-form-item prop="loginPwd" label="密码" v-else>
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
        <el-button @click="cancelAdd">取 消</el-button>
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
import {doDelete, doGet, doPost, doPut} from "../http/httpRequest.js";
import {Search} from "@element-plus/icons-vue";
import {messageConfirm, messageTip} from "../util/util.js";

export default {
  name: "UserView",

  //注入父页面的属性、函数
  inject: ['reload'],

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

      //用户id的数组
      userIdArray: [],

    }
  },

  mounted() {
    this.getUserList(1);
  },

  methods: {
    //勾选或取消触发此函数(已经勾选的数据会传给这个函数)
    handleSelectionChange(selectionDataArray) {
      this.userIdArray = [];
      // console.log(selectionDataArray);
      selectionDataArray.forEach(data => {
        let userId = data.id;
        this.userIdArray.push(userId);
      })
    },

    //获取所有用户的信息   current 当前页
    getUserList(current) {
      doGet("/api/user/list", {current}).then((resp) => {
        if (resp.data.code === 200) {
          // console.log(resp);
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
      this.userQuery.id = 0;
      this.userDialogVisible = true;
    },

    //取消保存
    cancelAdd() {
      this.$refs.userRefForm.resetFields();
      this.userDialogVisible = false;
    },

    //新增或编辑用户  提交保存
    userSubmit() {
      //FormData就像java的map，一个key一个value,通过formData.append()来添加数据
      let formData = new FormData();
      //循环写入
      for (let field in this.userQuery) {
        formData.append(field, this.userQuery[field]);
      }
      this.$refs.userRefForm.validate((isValid) => {
        if (isValid) {
          //id大于0,表示编辑用户
          if (this.userQuery.id > 0) {
            doPut("/api/user", formData).then((resp) => {
              if (resp.data.code === 200) {
                // console.log(resp);
                messageTip("编辑成功", "success");
                //页面刷新
                this.reload();
              } else {
                // console.log(resp);
                messageTip("编辑失败", "error");
              }
            })
          } else {
            //新增用户
            doPost("/api/user", formData).then((resp) => {
              if (resp.data.code === 200) {
                // console.log(resp);
                messageTip("提交成功", "success");
                //页面刷新
                this.reload();
              } else {
                messageTip("提交失败", "error");
              }
            })
          }
          //关闭弹窗
          this.userDialogVisible = false;
        }
      })
    },

    //操作-编辑用户
    edit(id) {
      this.userDialogVisible = true;
      this.loadUser(id);
    },

    //编辑用户-信息回显
    loadUser(id) {
      doGet("/api/user/" + id, {}).then((resp) => {
        if (resp.data.code === 200) {
          this.userQuery = resp.data.data;
        }
      })
    },

    //删除用户
    del(id) {
      messageConfirm("您确定要删除此用户吗？")
          //点击确定触发then()
          .then(() => {
            //删除
            doDelete("/api/user/" + id, {}).then(resp => {
              if (resp.data.code === 200) {
                messageTip("删除成功", "success");
                //刷新页面
                this.reload();
              } else {
                messageTip("删除失败，原因：" + resp.data.msg, "error");
              }
            })
          })
          //点击取消触发catch()
          .catch(() => {
            messageTip("取消删除", "warning");
          })
    },

    //批量删除
    batchDel() {
      if (this.userIdArray.length <= 0) {
        messageTip("请选择需要删除的数据", "warning")
        return;
      }
      messageConfirm("您确定要批量删除这些用户吗？")
          //点击确定触发then()
          .then(() => {
            //join作用  [1,2,3,4,5] ----> ids="1,2,3,4,5";
            let ids = this.userIdArray.join(',');
            doDelete("/api/user", {ids: ids})
                .then(resp => {
                  if (resp.data.code === 200) {
                    messageTip("批量删除成功", "success");
                    //刷新页面
                    this.reload();
                  } else {
                    messageTip("批量删除失败，原因：" + resp.data.msg, "error");
                  }
                })
          })
          //点击取消触发catch()
          .catch(() => {
            messageTip("取消批量删除", "warning");
          })
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