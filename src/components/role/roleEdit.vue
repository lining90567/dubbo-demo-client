<template>
  <el-dialog :title="dialogProps.title" :visible.sync="dialogProps.visible" width="560px" 
    @open="handleDialogOpen()" v-loading="loading">
    <div slot="title" class="dialog-header">{{ dialogProps.title }}</div>
    <el-form :model="roleModel" :rules="formRules" 
      ref="roleForm" label-width="80px" label-position="right" size="small">
      <el-form-item label="角色代码" prop="code">
        <el-col :span="16"><el-input ref="code" :maxlength="32" v-model="roleModel.code" autofocus></el-input></el-col>
      </el-form-item>
      <el-form-item label="角色名" prop="name">
        <el-col :span="16"><el-input :maxlength="32" v-model="roleModel.name"></el-input></el-col>
      </el-form-item>
      <el-form-item label="禁用">
        <el-switch v-model="roleModel.locked"></el-switch>
      </el-form-item>       
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button size="small" @click="handleDialogClose()">取 消</el-button>
      <el-button type="primary" size="small" @click="submitForm('roleForm')">确 定</el-button>
    </span>    
  </el-dialog>
</template>

<script>
import { saveRole, updateRole } from '@/api/role'

export default {
  name: 'role-edit',
  data() {
    return {
      loading: false,
      roleModel: {
        id: 0,
        code: '',
        name: '',
        locked: false
      },
      dialogProps: {
        visible: false,
        action: '',
        title: ''
      },
      formRules: {
        code: [
          { required: true, message: '请输入角色代码', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ],        
        name: [
          { required: true, message: '请输入角色名称', trigger: 'blur' },
          { min: 3, max: 32, message: '长度在 3 到 32 个字符', trigger: 'blur' }
        ]
      }
    }    
  },
  methods: {
    submitForm(formName) {
      this.$refs[formName].validate(valid => {
        if (valid) {
          if(this.dialogProps.action === 'add') {
            this.doSaveRole()
          } else {
            this.doUpdateRole()
          }
        } else {
          return false
        }
      });
    },
    doUpdateRole() {
      this.loading = true
      updateRole(this.roleModel.id, this.roleModel)
      .then(response => {
        this.loading = false
        this.dialogProps.visible = false
        this.$emit('save-finished')
      })
      .catch(error => {
        this.outputError(error)       
      })
    },
    doSaveRole() {
      this.loading = true
      saveRole(this.roleModel)
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
        this.$refs['roleForm'].clearValidate()
        this.$refs['code'].focus()
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
      this.$on('openEditRoleDialog', function(role) {
        this.roleModel = role
        this.dialogProps.action = 'edit'
        this.dialogProps.title = '修改角色'
        this.dialogProps.visible = true
      })
      this.$on('openAddRoleDialog', function() {
        this.dialogProps.action = 'add'
        this.dialogProps.title = '添加角色'
        this.roleModel = {
          locked: false
        }
        this.dialogProps.visible = true
      })
    })
  }  
}
</script>

