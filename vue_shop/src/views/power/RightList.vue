<template>
  <!-- 权限列表 -->
  <el-card class="box-card">
    <el-table :data="rightList" border stripe>
      <el-table-column label="#" type="index"></el-table-column>
      <el-table-column label="权限名称" prop="authName"></el-table-column>
      <el-table-column label="路径" prop="path"></el-table-column>
      <el-table-column label="权限等级" prop="level">
          <template slot-scope="scope">
              <el-tag v-if="scope.row.level=='0'">一级</el-tag>
              <el-tag v-if="scope.row.level=='1'" type="success">二级</el-tag>
              <el-tag v-if="scope.row.level=='2'" type="warning">三级</el-tag>
          </template>

      </el-table-column>
    </el-table>
  </el-card>
</template>




<script>
export default {
  data() {
    return {
      //所有权限列表
      rightList: []
    };
  },

  created() {
    this.GetRightList();
  },

  methods: {
    //    获取权限列表接口   请求地址：rights/:type  type等于list
    async GetRightList() {
      const res = await this.$http.get("rights/list");
      console.log(res, "获取所有权限列表");
      this.rightList = res.data.data;
    }
  }
};
</script>




<style lang="less" scoped>
</style>