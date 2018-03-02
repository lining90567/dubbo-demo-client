<template>
  <el-dialog :title="dialogProps.title" :visible.sync="dialogProps.visible" width="560px" 
    @open="handleDialogOpen()" v-loading="loading">
    <div slot="title" class="dialog-header">{{ dialogProps.title }}</div>
    <el-form :model="resourceModel" :rules="formRules" 
      ref="resourceForm" label-width="80px" label-position="right" size="small">
      <el-form-item label="路由">
        <el-col :span="16"><el-input :readonly="true" v-model="resourceModel.routerName"></el-input></el-col>
      </el-form-item>
      <el-form-item label="资源名称" prop="name">
        <el-col :span="16"><el-input ref="name" :maxlength="32" v-model="resourceModel.name"></el-input></el-col>
      </el-form-item>      
      <el-form-item label="资源代码" prop="code">
        <el-col :span="16"><el-input :maxlength="32" v-model="resourceModel.code" autofocus></el-input></el-col>
      </el-form-item>
      <el-form-item label="Url" prop="url">
        <el-col :span="16"><el-input :maxlength="64" v-model="resourceModel.url"></el-input></el-col>
      </el-form-item>
      <el-form-item label="权限代码" prop="permission">
        <el-col :span="16"><el-input :maxlength="32" v-model="resourceModel.permission"></el-input></el-col>
      </el-form-item>      
      <el-form-item label="禁用">
        <el-switch v-model="resourceModel.locked"></el-switch>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleDialogClose()">取 消</el-button>
      <el-button type="primary" size="small" @click="submitForm('resourceForm')">确 定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import { saveResource, updateResource } from '@/api/resource'

export default {
  name: 'resource-edit',
  data() {
    return {
      loading: false,
      resourceModel: {
        id: 0,
        code: '',
        name: '',
        url: '',
        permssion: '',
        locked: false,
        routerId: 0,
        routerName: ''
      },
      dialogProps: {
        visible: false,
        action: '',
        title: ''
      },
      formRules: {
        code: [
          { required: true, message: '请输入资源代码', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],   
        name: [
          { required: true, message: '请输入资源名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],
        url: [
          { required: true, message: '请输入url', trigger: 'blur' },
          { min: 6, max: 64, message: '长度在 6 到 64 个字符', trigger: 'blur' }
        ],
        permission: [
          { required: true, message: '请输入权限代码', trigger: 'blur' },
          { min: 6, max: 50, message: '长度在 6 到 50 个字符', trigger: 'blur' }
        ]        
      }
    }    
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.dialogProps.action === 'add') {
            this.doSaveResource()
          } else {
            this.doUpdateResource()
          }
        } else {
          return false
        }
      });
    },
    doUpdateResource() {
      this.loading = true
      updateResource(this.resourceModel.id, this.resourceModel)
      .then(response => {
        this.loading = false
        this.dialogProps.visible = false
        this.$emit('save-finished')
      })
      .catch(error => {
        this.outputError(error)       
      })
    },
    doSaveResource() {
      this.loading = true
      saveResource(this.resourceModel)
      .then(response => {
        this.loading = false
        this.dialogProps.visible = false
        this.$emit('save-finished')
      })
      .catch(error => {
        this.outputError(error)         
      })
    },    
    handleDialogClose() {
      this.dialogProps.visible = false  
    },
    handleDialogOpen() {
      this.$nextTick(() => {
        this.$refs['resourceForm'].clearValidate()
        this.$refs['name'].focus()
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
      this.$on('openEditResourceDialog', function(resource) {
        this.resourceModel = resource
        this.dialogProps.action = 'edit'
        this.dialogProps.title = '修改资源'
        this.dialogProps.visible = true
      })
      this.$on('openAddResourceDialog', function(router) {
        this.dialogProps.action = 'add'
        this.dialogProps.title = '添加资源'
        this.resourceModel = {
          locked: false,
          routerId: router.id,
          routerName: router.name
        }
        this.dialogProps.visible = true
      })
    })
  }  
}
</script>

