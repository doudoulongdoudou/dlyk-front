<template>
  <!-- 搜索框 -->
  <el-form :inline="true" :model="activityQuery" :rules="activityRules">
    <el-form-item label="负责人" style="width: 200px">
      <el-select
          v-model="activityQuery.ownerId"
          placeholder="请选择负责人"
          @click="loadOwner"
          clearable
      >
        <el-option v-for="item in ownerOptions"
                   :key="item.id"
                   :label="item.name"
                   :value="item.id"/>
      </el-select>
    </el-form-item>

    <el-form-item label="活动名称">
      <el-input v-model="activityQuery.name" placeholder="请输入活动名称" clearable/>
    </el-form-item>

    <el-form-item label="活动时间">
      <el-date-picker
          v-model="activityQuery.activityTime"
          type="datetimerange"
          start-placeholder="开始时间"
          end-placeholder="结束时间"
          value-format="YYYY-MM-DD HH:mm:ss"
      />
    </el-form-item>

    <el-form-item label="活动预算" prop="cost">
      <el-input v-model="activityQuery.cost" placeholder="请输入活动预算(元)" clearable/>
    </el-form-item>

    <el-form-item label="创建时间">
      <el-date-picker
          v-model="activityQuery.createTime"
          type="datetime"
          value-format="YYYY-MM-DD HH:mm:ss"
          placeholder="请选择创建时间"
      />
    </el-form-item>

    <el-form-item>
      <el-button type="primary" @click="onSearch">搜索</el-button>
      <el-button type="primary" @click="onReset" plain>重置</el-button>
    </el-form-item>
  </el-form>

  <el-button plain class="topButton" @click="add" type="primary">添加用户</el-button>
  <el-button class="topButton" type="danger" @click="batchDel">批量删除</el-button>

  <!-- 表格 -->
  <el-table
      ref="multipleTableRef"
      :data="activityList"
      @selection-change="handleSelectionChange"
  >
    <el-table-column type="selection" width="55"/>
    <el-table-column type="index" label="序号" width="55"/>
    <el-table-column property="ownerDO.name" label="负责人" show-overflow-tooltip/>
    <el-table-column property="name" label="活动名称" show-overflow-tooltip/>
    <el-table-column property="startTime" label="开始时间" show-overflow-tooltip/>
    <el-table-column property="endTime" label="结束时间" show-overflow-tooltip/>
    <el-table-column property="cost" label="活动预算(元)" show-overflow-tooltip/>
    <el-table-column property="createTime" label="创建时间" show-overflow-tooltip/>

    <!--操作-->
    <el-table-column fixed="right" label="操作" width="150">
      <template #default="scope">
        <el-button link type="primary" size="small" @click.prevent="view(scope.row.id)">详情</el-button>
        <el-button link type="primary" size="small" @click.prevent="edit(scope.row.id)">编辑</el-button>
        <el-button link type="primary" size="small" @click.prevent="del(scope.row.id)">删除</el-button>
      </template>
    </el-table-column>
  </el-table>

  <!-- 分页 -->
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

export default {
  name: "ActivityView",

  data() {
    return {
      //市场活动搜索表单对象
      activityQuery: {},
      //市场活动列表对象
      activityList: [{
        ownerDO: {},
      }],
      //分页参数
      total: '',
      pageNum: '',

      //负责人选项
      ownerOptions: [{}],

      //搜索验证规则
      activityRules: {
        cost: [
          {pattern: /^[0-9]+(\.[0-9]{2})?$/, message: '活动预算需满足整数或保留2位小数', trigger: 'blur'}
        ]
      },


    }
  },

  mounted() {
    //
    this.getActivityList(1);
  },

  methods: {
    //获取所有用户的信息   current 当前页
    getActivityList(current) {

      let startTime = '';
      let endTime = '';
      for (let key in this.activityQuery.activityTime) {
        if (key == '0') {
          startTime = this.activityQuery.activityTime[key];
        }
        if (key == '1') {
          endTime = this.activityQuery.activityTime[key];
        }
      }

      doGet("/api/activity/list", {
        current: current,
        //搜索条件
        ownerId: this.activityQuery.ownerId,
        name: this.activityQuery.name,
        startTime: startTime,
        endTime: endTime,
        cost: this.activityQuery.cost,
        createTime: this.activityQuery.createTime,
      }).then((resp) => {
        if (resp.data.code === 200) {
          // console.log(resp);
          this.activityList = resp.data.data.list;
          this.pageNum = resp.data.data.pageNum;
          this.pageSize = resp.data.data.pageSize;
          this.total = resp.data.data.total;
        }
      })
    },

    //分页函数-改变当前页
    handleCurrentChange(pageNum) {
      this.getActivityList(pageNum);
    },

    //搜索框预加载负责人名字选项
    loadOwner() {
      doGet("/api/owner", {}).then(resp => {
        if (resp.data.code === 200) {
          // console.log(resp);
          this.ownerOptions = resp.data.data;
        }
      })
    },

    //搜索
    onSearch() {
      this.getActivityList(1);
    },

    //搜索重置
    onReset() {
      this.activityQuery = {};
    },

  },


}
</script>

<style scoped>
.el-form {
  margin-bottom: 15px;
}

.el-table {
  height: 80%;
  width: 100%;
  margin-top: 20px;
}

.el-pagination {
  height: 5%;
}
</style>