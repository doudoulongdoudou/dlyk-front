<template>

  <el-input
      v-model="input2"
      type="text"
      style="width: 240px"
      placeholder="请输入查询账号"
      :prefix-icon="Search"
  />
  <el-button class="topButton" type="primary">添加用户</el-button>
  <el-button class="topButton" type="danger">批量删除</el-button>

  <el-table
      ref="multipleTableRef"
      :data="userList"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55"/>
    <el-table-column type="index" label="序号" width="55"/>
    <el-table-column property="loginAct" label="账号" show-overflow-tooltip />
    <el-table-column property="name" label="姓名" show-overflow-tooltip />
    <el-table-column property="phone" label="手机号" show-overflow-tooltip />
    <el-table-column property="email" label="邮箱" show-overflow-tooltip />
    <el-table-column property="createTime" label="创建时间" show-overflow-tooltip />
    <el-table-column property="editTime" label="修改时间" show-overflow-tooltip />
    <el-table-column property="lastLoginTime" label="上次登录" show-overflow-tooltip />

    <!--操作-->
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deleteRow(scope.$index)"
        >
          详情
        </el-button>
        <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deleteRow(scope.$index)"
        >
          编辑
        </el-button>
        <el-button
            link
            type="primary"
            size="small"
            @click.prevent="deleteRow(scope.$index)"
        >
          删除
        </el-button>
      </template>
    </el-table-column>
  </el-table>

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
import {doGet} from "../http/httpRequest.js";
import {Search} from "@element-plus/icons-vue";

export default {
  name: "UserView",
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

      //分页参数
      total: '',
      pageNum: '',

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
</style>