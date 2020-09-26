<template>
 <div>
    <el-card>
      <el-row :gutter="20">
        <el-col :span="8">
          <el-input placeholder="请输入内容" v-model="queryGoods.query" class="input-with-select">
            <el-button slot="append" icon="el-icon-search" @click="goodsList()"></el-button>
          </el-input>
        </el-col>
        <el-col :span="3">
          <el-button type="primary">添加用户</el-button>
        </el-col>
      </el-row>

      <!-- 商品列表 -->
      <el-table :data="GoodsListData" style="width: 100%" border stripe>
        <el-table-column label="#" type="index" width="80" align="center"></el-table-column>
        <el-table-column prop="goods_name" label="商品名称" width="800" align="center"></el-table-column>
        <el-table-column prop="goods_price" label="价格" width="180" align="center"></el-table-column>
        <el-table-column prop="goods_weight" label="重量" align="center"></el-table-column>
        <el-table-column prop="add_time" label="添加时间" align="center"></el-table-column>
        <el-table-column  label="操作" align="center">
            <template slot-scope="scope">
                <el-button type="primary" size="small" icon="el-icon-edit"></el-button>
                <el-button type="warning" size="small" icon="el-icon-delete" @click="GoodsDelete(scope.row.goods_id)"></el-button>
            </template>
        </el-table-column>
      </el-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryGoods.pagenum"
      :page-sizes="[10,15,20,30,50,100,150]"
      :page-size="queryGoods.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>
    </el-card>
  </div>
</template>




<script>
export default {
  data() {
    return {
      queryGoods: {
        query: "",
        pagenum: 1, //当前页码
        pagesize: 10 //当前每页显示多少条数据
      },
      // 商品列表
      GoodsListData: [],
      total: 0,
    };
  },
  created() {
    this.goodsList();
  },

  methods: {
    //  获取所有商品列表  请求地址：goods
    async goodsList() {
      const res = await this.$http.get("goods", { params: this.queryGoods});
      console.log(res, "商品列表数据");
      this.GoodsListData=res.data.data.goods;
      this.total = res.data.data.total
    },
    //监听pagesize改变的事件
    handleSizeChange(newsize) {
        console.log(newsize);
        this.queryGoods.pagesize=newsize;
        this.goodsList()
      },
    //监听页码值的变化
    handleCurrentChange(newPage) {
        console.log(newPage,'当前页码');
         this.queryGoods.pagesize=newPage;
        this.goodsList()
      },

    //删除 请求路径：goods/:id
    async GoodsDelete(goods_id){
      console.log(goods_id);
      const confirmResult = await this.$confirm("是否确定删除该商品?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      }).catch(err => err);
      if (confirmResult !== "confirm") return this.$message.info("已取消");
      const res = await this.$http.delete('goods/'+goods_id)
        console.log(res,'删除')
        if (res.data.meta.status == 200) {
          this.$message.success("删除成功");
          this.goodsList();
        }
    },

  }
};
</script>




<style lang="less" scoped>
.el-table {
  margin: 20px 0;
  
}
</style>