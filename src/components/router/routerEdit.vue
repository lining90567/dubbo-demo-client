<template>
  <el-dialog :title="dialogProps.title" :visible.sync="dialogProps.visible" width="660px" 
     @open="handleDialogOpen()" v-loading="loading">
    <div slot="title" class="dialog-header">{{ dialogProps.title }}</div>
    <el-form :inline="true" :model="routerModel" :rules="formRules" ref="routerForm" 
      label-width="80px" label-position="right" size="small">
      <el-row>
        <el-col :span="12">
          <el-form-item label="代码">
            <el-input ref="routerCode" :maxlength="50" v-model="routerModel.code" autofocus></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="名称" prop="name">
            <el-input :maxlength="50" v-model="routerModel.name"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="URL">
            <el-input :maxlength="50" v-model="routerModel.url"></el-input>
          </el-form-item>          
        </el-col>
        <el-col :span="12">
          <el-form-item label="上级路由">
              <el-select class="parent-router-select" v-model="routerModel.parentId" placeholder="请选择">
                  <el-option
                    v-for="item in this.parentRouterList"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id">
                  </el-option>
                </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="禁用">
            <el-switch v-model="routerModel.locked"></el-switch>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="显示序号">
            <el-input-number v-model="routerModel.displayOrder"></el-input-number>
          </el-form-item>          
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="路由层级">
            <el-input-number :min="1" v-model="routerModel.level"></el-input-number>
          </el-form-item>          
        </el-col>        
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="扩展属性">
            <el-input class="properties-textarea" type="textarea" :rows="5" v-model="routerModel.properties"></el-input>          
          </el-form-item>
        </el-col>
      </el-row>      
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleDialogClose()">取 消</el-button>
      <el-button type="primary" size="small" @click="submitForm('routerForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { listByParentId, saveRouter, updateRouter } from '@/api/router'

export default {
  name: 'router-edit',
  props: ['parentRouterList'],
  data() {
    return {
      loading: false,
      routerModel: {
        id: 0,
        code: '',
        name: '',
        url: '',
        parentId: 0,
        locked: false,
        displayOrder: 0,
        properties: ''
      },
      dialogProps: {
        visible: false,
        action: '',
        title: ''
      },
      formRules: {
        name: [
          { required: true, message: '请输入路由名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ] 
      },
      parentRouters: [
        {
          value: 0,
          label: '请选择'
        }        
      ]   
    }
  },
  methods: {
    handleDialogOpen() {
      this.$nextTick(() => {
        this.$refs['routerForm'].clearValidate()
        this.$refs['routerCode'].focus()
      })
    },
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {          
          if(this.dialogProps.action === 'add') {
            this.doSaveRouter()
          } else {
            this.doUpdateRouter()
          }
        } else {
          return false;
        }
      });
    },    
    handleDialogClose() {
      this.dialogProps.visible = false
    },
    doUpdateRouter() {
      this.loading = true
      updateRouter(this.routerModel.id, this.routerModel)
      .then(response => {
        this.loading = false
        this.dialogProps.visible = false
        this.$emit('save-finished')
      })
      .catch(error => {
        this.outputError(error)      
      })      
    },
    doSaveRouter() {
      this.loading = true
      saveRouter(this.routerModel)
      .then(response => {
        this.loading = false
        this.dialogProps.visible = false
        this.$emit('save-finished')
      })
      .catch(error => {
        this.outputError(error)       
      })      
    },
    outputError(error) {
      console.log(error.response ? error.response : error.message)
      this.loading = false
      this.$message({
        showClose: true,
        message: '出错了，请按F12查看浏览器日志。',
        type: 'error'
      })      
    }    
  },
  mounted: function() {
    this.$nextTick(() => {  
      this.$on('openEditRouterDialog', function(router) {
        this.routerModel = router
        this.dialogProps.action = 'edit'
        this.dialogProps.title = '修改路由'
        this.dialogProps.visible = true
      })
      this.$on('openAddRouterDialog', function() {
        this.dialogProps.action = 'add'
        this.dialogProps.title = '添加路由'
        this.routerModel = {}
        this.dialogProps.visible = true
      })
    })
  }    
}
</script>

<style lang="scss" scoped>
  .parent-router-select {
    width: 188px;
  }
  .properties-textarea {
    width: 496px;
  }
</style>


