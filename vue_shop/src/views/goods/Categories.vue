<template>
  <div>
    <el-card>
      <el-row>
        <el-col>
          <el-button type="primary" @click="showAddCate()">添加分类</el-button>
        </el-col>
      </el-row>
    
    <tree-table class="tree-table" :data='cateList'  :columns="columns" :selection-type="false"  :expand-type="false" show-index index-text="#" border show-row-hover>
        <template slot='isOK' slot-scope="scope">
            <i class="el-icon-success" v-if='scope.row.cat_deleted===false' style='color:green;'></i>
            <i class="el-icon-error" v-else  style='color:red;'></i>
        </template>
        <template slot='order' slot-scope="scope">
            <el-tag v-if='scope.row.cat_level===0' size='mini'>一级</el-tag>
            <el-tag v-else-if='scope.row.cat_level===1' type="success" size='mini'>二级</el-tag>
            <el-tag v-else type="warning" size='mini'>三级</el-tag>
        </template>
        <template slot="oper" slot-scope="scope">
            <el-button type="primary" icon="el-icon-edit" size="mini" @click="cateEdit(scope.row)">编辑</el-button>
            <el-button type="danger" icon="el-icon-delete" size="mini" @click="cateDelete(scope.row)">删除</el-button>
        </template>
    </tree-table>

    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page.sync="queryCategories.pagenum"
      :page-sizes="[5,10,15,20,30,50,100]"
      :page-size="queryCategories.pagesize"
      layout="total, sizes, prev, pager, next, jumper"
      :total="total">
    </el-pagination>

    </el-card>


    <el-dialog title="添加分类" :visible.sync="AddCateDialogVisible" width="30%" >
       
       <el-form :model='AddCateForm' :rules="AddCateRules" ref="AddCateRef"  label-width="100px">
        <el-form-item label="分类名称：" prop="cat_name">
            <el-input v-model="AddCateForm.cat_name"></el-input>
        </el-form-item>
        <el-form-item label="父级分类：" >
            
        </el-form-item>
       </el-form>

        <span slot="footer" class="dialog-footer">
            <el-button @click="AddCateDialogVisible = false">取 消</el-button>
            <el-button type="primary" @click="AddCateDialogVisible = false">确 定</el-button>
        </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
    data(){
        return{
            //查询条件
            queryCategories:{
                type:3,
                pagenum:1,
                pagesize:10
            },
            //商品分类的列表，默认为空
            cateList:[],
            total:0,
            columns:[
                {
                    label:'分类名称',
                    prop:'cat_name'
                },
                {
                    label:'是否有效',
                    //表示将当前列定义为模板列
                    type:'template',
                    //表示当前的模板名称
                    template:'isOK'

                },
                {
                    label:'排序',
                    //表示将当前列定义为模板列
                    type:'template',
                    //表示当前的模板名称
                    template:'order'
                },
                {
                    label:'操作',
                    //表示将当前列定义为模板列
                    type:'template',
                    //表示当前的模板名称
                    template:'oper'
                }
            ],

            // 新增对话框

            AddCateDialogVisible:false, //对话框显示与隐藏
            //添加分类名称的表单
            AddCateForm:{
                cat_name:'',
                cat_pid:0,  //父级分类的id
                cat_level:0 //默认添加的分类是一级分类

            },
            AddCateRules:{
                cat_name: [
                { required: true, message: "请输入分类名称", trigger: "blur" },
                { min: 3, max: 5, message: "长度在 5 到 10 个字符", trigger: "blur" }
                ],
            }
        }
    },


    created(){
        this.getCateList()
    },


    methods:{
        //获取所有商品分类 请求路径：categories  
        async getCateList(){
            const res = await this.$http.get('categories',{params:this.queryCategories})
            console.log(res,'获取所有商品分类')
            if(res.data.meta.status==200){
                this.cateList = res.data.data.result
                this.total=res.data.data.total
            }
        },
        //监听pagesize改变的事件
        handleSizeChange(newsize) {
            console.log(newsize);
            this.queryCategories.pagesize=newsize;
            this.getCateList()
        },
        //监听页码值的变化
        handleCurrentChange(newPage) {
            console.log(newPage,'当前页码');
            this.queryCategories.pagesize=newPage;
            this.getCateList()
        },
        //  获取父级分类的数据列表
        async getParentCateList(){
           const res = await this.$http.get('categories',{params:{type:2}})
            console.log(res,'获取父级分类')
        },

        async showAddCate(){
            const res = await this.$http.post('categories',this.AddCateForm)
            console.log(res,'添加分类')
            this.getParentCateList()
            this.AddCateDialogVisible=true
        },


    },
}
</script>
<style lang="less" scoped>
    .tree-table{
        margin: 20px 0;
    }
</style>
