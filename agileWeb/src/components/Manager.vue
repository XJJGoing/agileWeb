<template>
  <div style="position: relative;height: 100%">
    <el-container style="height: 100%; border: 1px solid #eee">

      <el-aside width="200px" style="background-color: rgb(238, 241, 246)">
        <el-menu :default-openeds="['1','2']">

          <el-submenu index="1" style="background-color:#67C23A">
            <template slot="title" >
              <i class="el-icon-suitcase"></i>项目
            </template>
             <div v-for="(item,index) in projectArray" :key="index">
                <el-menu-item @click="chooseProject" :index="1+'-'+(index+1)" :id="JSON.stringify(item)">
                  {{item.projectName}}
                </el-menu-item>
             </div>
          </el-submenu>

          <el-submenu index="2" style="background-color:#F56C6C">
            <template slot="title">
              <i class="el-icon-s-flag"></i>冲刺
            </template>
            <div v-for="(item,index) in sprintArray" :key="index">
              <el-menu-item @click="chooseSprint" :index="2+'-'+(index+1)" :id="JSON.stringify(item)">
                {{item.sprintName}}
              </el-menu-item>
            </div>
          </el-submenu>

          <el-submenu index="3" style="background-color: darkgray">
            <template slot="title">
              <i class="el-icon-setting"></i>专业
            </template>

            <div v-for="(item,index) in departmentArray" :key="index">
              <el-menu-item @click="chooseDepartment" :index="3+'-'+(index+1)" :id="JSON.stringify(item)">
                {{item.departmentName}}
              </el-menu-item>
            </div>
          </el-submenu>

          <el-submenu index="4" style="background-color:#E6A23C">
            <template slot="title">
              <i class="el-icon-user-solid"></i>人员
            </template>
            <div v-for="(item,index) in departmentAllUserArray" :key="index">
              <el-menu-item @click="chooseDepartmentUser" :index="4+'-'+(index+1)" :id="JSON.stringify(item)">
                {{item.trueName}}
              </el-menu-item>
            </div>
          </el-submenu>
        </el-menu>
      </el-aside>

      <el-container>

        <el-header style="text-align: right; font-size: 12px">
          <div class="detailMessage">
            <div>
                <el-tag effect="dark"  type="success">
                  <i class="el-icon-suitcase"></i>:{{chooseProjectName}}
                </el-tag>
            </div>
            <div>
              <el-tag effect="dark" type="danger">
                <i class="el-icon-s-flag"></i>:{{chooseSprintName}}
              </el-tag>
            </div>
            <div>
              <el-tag effect="dark"  type="info">
                <i class="el-icon-setting"></i>:{{chooseDepartmentName}}
              </el-tag>
            </div>
            <div>
              <el-tag effect="dark" type="warning">
                <i class="el-icon-user-solid"></i>:{{chooseDepartmentTruName}}
              </el-tag>
            </div>
          </div>

          <div class="detailFunction">

               <el-button type="primary" @click="importTask">
                    导入<i class="el-icon-upload el-icon--right"></i>
               </el-button>

              <el-button type="success" @click="downLoadExcel">
                    导出<i class="el-icon-download el-icon--right"></i>
              </el-button>
              <el-button @click="addNewTask">
                新增任务<i class="el-icon-circle-plus-outline"></i>
              </el-button>
              <el-button @click="deleteAllChooseTask" type="danger">
                 删除已选<i class="el-icon-delete"></i>
              </el-button>
          </div>

          <el-dropdown @command="chooseSetting">
            <i class="el-icon-setting" style="margin-right: 15px"></i>
            <el-dropdown-menu slot="dropdown" >
              <el-dropdown-item command="1">个人中心</el-dropdown-item>
              <el-dropdown-item style="color: red" command="0">退出登录</el-dropdown-item>
            </el-dropdown-menu>
          </el-dropdown>

          <div class="avatar">
            <el-image fit="fill" :src='userInfo.avatarUrl'></el-image>
            <span>{{userInfo.trueName}}</span>
          </div>
          <div class="clear-float"></div>

        </el-header>

        <el-main>
          <el-table
            v-loading="isLoading"
            :data="tableData"
            ref="multipleTable"
            style="width: 100%"
            header-align="center"
            tooltip-effect="dark"
            @selection-change="handleSelectionChange"
          >

            <el-table-column
              align="center"
              type="selection"
              width="55"
            >

            </el-table-column>

            <el-table-column
              align="center"
              label="序号"
              prop="taskOrder"
              width="60"
            >

            </el-table-column>

            <el-table-column
              label="待办任务"
              prop="taskName"
              align="center"
            >
            </el-table-column>

            <el-table-column
              label="优先级"
              prop="taskPriority"
              align="center"
            >
            </el-table-column>

            <el-table-column
              label="预估工时"
              prop="taskPredictTime"
              align="center"
            >
            </el-table-column>

            <el-table-column
              label="实际工时"
              prop="actualWorkingHours"
              align="center"
            >
            </el-table-column>

            <el-table-column
              label="状态"
              prop="taskStateName"
              align="center"
            >
            </el-table-column>

            <el-table-column
              label="执行人"
              prop="taskExecuteTrueName"
              align="center"
            >
            </el-table-column>


            <el-table-column
              align="center"
            >
              <template slot="header" slot-scope="scope">
                <el-input
                  v-model="search"
                  prefix-icon="el-icon-search"
                  size="mini"
                  placeholder="任务序号"
                  @input="queryTask"
                ></el-input>
              </template>

              <template slot-scope="scope">
                <el-button
                  size="mini"
                  @click="handleEdit(scope.$index, scope.row)"
                >编辑
                </el-button>

                <el-button
                  size="mini"
                  type="danger"
                  @click="handleDelete(scope.$index, scope.row)"
                >删除
                </el-button>

              </template>

            </el-table-column>
          </el-table>

          <el-pagination
            background
            layout="prev, pager, next"
            :page-size="pageSize"
            :total="allTask.length"
            :page-count="pageCount"
            @prev-click="pageChange"
            @next-click="pageChange"
            @current-change="pageChange"
          >

          </el-pagination>
        </el-main>

        <el-drawer
          title="编辑任务"
          :visible.sync="drawer"
          :direction="direction"
          custom-class=""
          size="30%"
        >
          <el-form ref="form" :model="taskForm" label-width="80px" v-loading="isFormLoading">
            <el-form-item label="任务序号">
              <el-input v-model="taskForm.taskOrder"></el-input>
            </el-form-item>
            <el-form-item label="任务内容">
              <el-input v-model="taskForm.taskName"></el-input>
            </el-form-item>
            <el-form-item label="实际工时">
              <el-input v-model="taskForm.actualWorkingHours"></el-input>
            </el-form-item>
            <el-form-item label="预估工时">
              <el-input v-model="taskForm.taskPredictTime"></el-input>
            </el-form-item>
            <el-form-item label="优先级">
              <el-select v-model="taskForm.taskPriority" placeholder="请选择优先级">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item label="任务状态">
              <el-select v-model="taskForm.taskStateName" placeholder="请选择任务状态">
                <el-option label="未开始" value="未开始"></el-option>
                <el-option label="完成" value="完成"></el-option>
                <el-option label="中止" value="中止"></el-option>
                <el-option label="进行中" value="进行中"></el-option>
              </el-select>
            </el-form-item>

            <el-form-item>
              <el-button type="primary" @click="onSubmit">提交修改</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>

        </el-drawer>

        <el-drawer
          title="新增任务"
          :visible.sync="addTaskDrawer"
          :direction="addTaskDirection"
          custom-class=""
          size="30%"
        >
          <el-form ref="form" :model="newTaskForm" label-width="80px" v-loading="isFormLoading">
            <el-form-item label="任务内容">
              <el-input v-model="newTaskForm.taskName"></el-input>
            </el-form-item>
            <el-form-item label="预估工时">
              <el-input v-model="newTaskForm.taskPredictTime"></el-input>
            </el-form-item>
            <el-form-item label="优先级">
              <el-select v-model="newTaskForm.taskPriority" placeholder="请选择优先级">
                <el-option label="1" value="1"></el-option>
                <el-option label="2" value="2"></el-option>
                <el-option label="3" value="3"></el-option>
                <el-option label="4" value="4"></el-option>
              </el-select>
            </el-form-item>
            <el-form-item>
              <el-button type="primary" @click="onSubmitTask">提交</el-button>
              <el-button>取消</el-button>
            </el-form-item>
          </el-form>
        </el-drawer>

        <el-drawer
          title="导入任务"
          :visible.sync="importTaskDrawer"
          :direction="importTaskDirection"
          custom-class="drawer"
          size="30%"
        >
        <el-form  inline  :model="form">
          <el-upload
            class="upload-box"
            ref="upload"
            action=""
            :limit="1"
            accept=".xls,.xlsx"
            :file-list="fileList"
            style="width: 400px"
            :on-change="changeFile"
            :on-exceed="handleExceed"
            :on-error="failUpload"
            :auto-upload="false"
          >
            <el-button slot="trigger" size="small" type="primary">选取文件</el-button>
            <el-button style="margin-left: 10px;" size="small" type="success" @click.prevent="submitUpload">上传到服务器</el-button>
            <div slot="tip" class="el-upload__tip">选择xls/xlsx文件上传,并且注意上传文件的格式</div>
          </el-upload>
        </el-form>

        </el-drawer>

        <el-footer>
        </el-footer>

      </el-container>
    </el-container>
     <Footer></Footer>
  </div>
</template>

<script>
  var _this;
  import Footer from './Footer.vue';
  import {userProjectQuery,
          projectQuery,
          sprintQuery,
          departmentQueryAll,
          userProjectDepartmentQuery,
          taskQuery,
          taskAdd,
          taskDeleteBatch,
          taskUpdateBatch,
          dateWorkQuery,
          dateWorkUpdateBatch,
          importTaskData,
          taskDownLoadExcel

  } from '../js/api';
    export default {
        components:{
          Footer
        },
        name: "Manager",
        data(){
          return{
            userInfo:"",
            projectArray:[],
            chooseProjectName:"",
            chooseProjectId:"",

            sprintArray:[],
            chooseSprintName:'',
            choooseSprintId:"",

            //departmentAllArray:[],
            departmentArray:[],     //根据项目查询到的专业
            chooseDepartmentName:"" ,
            chooseDepartmentId:"",

            departmentAllUser:[],     //存放着该项目下所有人员的专业和用户id的信息
                                      //同departmentAllUserArray
            departmentAllUserArray:[],
            chooseDepartmentUserId:"",
            chooseDepartmentTruName:"",

            isLoading:false,

            tableData:[],
            allTask:[],
            search: '',          //输入任务序号进行查找
            pageCount:0,         //分页的总页数
            pageSize:10,          //每页显示的条数

            drawer:false,       //编辑任务弹出框
            direction: 'rtl',

            taskForm:{
              id:'',
              taskOrder:"",
              taskName:"",
              actualWorkingHours:"",
              taskPredictTime:"",
              taskPriority:"",
              taskState:"",
              taskStateName:""
            },
            editorTaskId:"",
            isFormLoading:false,

            addTaskDrawer:false,              //新建任务
            addTaskDirection:'ltr',

            newTaskForm:{
              taskName:"",
              taskPredictTime:'',
              lastChangeStr: "",
              taskPriority:"",
              taskState:0
            },


            form:{            //导入文件的表单数据
              projectId:"",
              sprintId:"",
              year:"",
              file:""
            },
            importTaskDrawer:false,
            importTaskDirection:'ttb',
            fileList:[],                //临时存放文件的列表

            taskDownLoadExcel:taskDownLoadExcel,  //导出Excel表格


            chooseTask:[],

           }
          },

          created(){
          _this = this;
          //let userInfo = JSON.parse(this.$route.query.userInfo);
           let userInfo = JSON.parse(this.jsCookies.get('userInfo'));
           console.log("拿到的用户的信息",userInfo);
           if(userInfo){
            _this.userInfo = userInfo;
            _this.enterIndexProject();
            this.$notify({
              title:'提醒',
              type:'success',
              message:"登录成功",
              duration:1500
            })
          }else{
            this.$router.push({
              path:'/',
            })
          }
        },

        mounted:function(){
          _this = this;
          let userInfo = this.jsCookies.get('userInfo');
          if(userInfo){

          }else{
            this.$router.push({
              path:'/'
            })
          }
        },
        methods:{


          //退出登录和个人中心
          chooseSetting:function(e){
            let command = parseInt(e);
             if(command===1){
                this.$message({
                  type:'warning',
                  message:"正在开发中"
                })
             }else if(command===0){
               this.jsCookies.remove('userInfo');
               this.$router.push({
                 path:'/'
               })
             }
          },


          //一开始进入的项目
          enterIndexProject: function () {
            _this = this;
            this.axios.post(projectQuery,{
              projectChargeUserId:_this.userInfo.id,
              pageSize:100000
            })
              .then(res=>{
                 console.log("查询到的项目的信息",res.data.data.records);
                _this.projectArray = res.data.data.records;
                _this.chooseProjectId = res.data.data.records[1].id;           //默认选中的项目
                _this.chooseProjectName = res.data.data.records[1].projectName;
                Promise.all([_this.getSprint(),_this.getAllDepartment(),_this.getAllDepartmentUserArray()])
                  .then(()=>{
                    _this.getTask();
                  })
                  .catch(Error=>{
                    console.log(Error)
                  });
              })
              .catch(Error=>{
                console.log(Error)
              })
          },


          //获取项目信息
          getProject: function () {
            _this = this;
            Promise.all([_this.getSprint(),_this.getAllDepartment(),_this.getAllDepartmentUserArray()])
              .then(()=>{
                _this.getTask();
              })
              .catch(Error=>{
                console.log(Error)
              });
          },

          //根据项目去获取相应的冲刺
          getSprint:function () {
            _this = this;
            return new Promise((resolve, reject) => {
              this.axios.post(sprintQuery,{
                projectId:_this.chooseProjectId,
                pageSize:10000,
              })
                .then(res=>{
                  console.log("查询到的冲刺的信息",res);
                  if(res.data.code===200){
                    if(res.data.data.records.length){
                      _this.sprintArray = res.data.data.records;
                      _this.chooseSprintId = res.data.data.records[0].id;
                      _this.chooseSprintName = res.data.data.records[0].sprintName;
                    }else{
                      _this.sprintArray = [];
                      _this.chooseSprintName = "暂无冲刺";
                      _this.sprintArray = [{sprintName:"暂无冲刺"}]
                    }
                    resolve()
                  }
                })
                .catch(Error=>{
                  console.log(Error);
                  reject(Error)
                })
            });
          },


          //获取该项目下的所有的专业
          getAllDepartment:function () {
            _this = this;
           console.log("查询专业的项目id",_this.chooseProjectId);
            return new Promise((resolve, reject) => {
              let url = `${departmentQueryAll}?projectId=${_this.chooseProjectId}`
              this.axios.post(url)
                .then(res=>{
                  console.log("获取到的专业信息",res);
                  if(res.data.code===200){
                    if(res.data.data.length){
                      let departmentArray = res.data.data;
                      let newDepartmentArray = [];

                       for(let i = 0;i<departmentArray.length;i++){
                          if(newDepartmentArray.length){
                            let jude = 1;                //判断是否有一样的专业
                             for(let j = 0;j<newDepartmentArray.length;j++){
                               if(newDepartmentArray[j].id===departmentArray[i].id){
                                 jude = 0
                               }
                             }
                             if(jude){
                               newDepartmentArray.push(departmentArray[i])
                             }
                          }else{
                            newDepartmentArray.push(departmentArray[i]);
                          }
                       }

                      _this.chooseDepartmentId = "";
                      _this.chooseDepartmentName = '全部';
                       newDepartmentArray.push({
                          departmentName: "全部"
                       });
                      _this.departmentArray = newDepartmentArray;
                    }else{
                      _this.chooseDepartmentId = "";
                      _this.departmentArray = [{
                         departmentName:"暂无专业"
                      }];
                    }
                    resolve();
                  }
                })
                .catch(Error=>{
                  console.log(Error);
                  reject()
                })
            })
          },

          //获取所有的人员
          getAllDepartmentUserArray:function () {
            _this = this;
            console.log("查询条件",_this.chooseProjectId);
            return new Promise((resolve, reject) => {
              this.axios.post(userProjectDepartmentQuery,{
                projectId:_this.chooseProjectId,
                pageSize:100000,
                pageNum:0
              })
                .then(res=>{
                  console.log("查询到的该项目下的专业人员的信息",res);
                  if(res.data.code===200){
                    let departmentAllArray = res.data.data.records;
                    _this.departmentAllUser = departmentAllArray;
                    if(departmentAllArray.length){
                       departmentAllArray.push({
                        trueName: "全部"
                      });
                      _this.chooseDepartmentUserId = "";
                      _this.departmentAllUserArray = departmentAllArray;
                      _this.chooseDepartmentTruName = "全部";
                    }else{
                      _this.departmentAllUserArray = [{
                        trueName:"暂无人员"
                      }];
                      _this.chooseDepartmentUserId = "";
                    }
                    resolve();
                  }
                })
                .catch(Error=>{
                  console.log(Error);
                  reject();
                })
            })
          },


          //选中项目后获取冲刺
          chooseProject:function (e) {
            _this = this;
            let chooseProject = JSON.parse(e.$attrs.id);
            console.log(chooseProject);
            _this.chooseProjectId = chooseProject.id;
            _this.chooseProjectName = chooseProject.projectName;
            _this.getProject();                         //重新获取一切信息
          },

          //选择冲刺
          chooseSprint:function(e){
            _this = this;
            let chooseSprint = JSON.parse(e.$attrs.id);
            _this.chooseSprintId = chooseSprint.id;
            _this.chooseSprintName = chooseSprint.sprintName;
            _this.getTask()
          },

          //选择专业
          chooseDepartment:function(e){
            _this = this;
            let chooseDepartment = JSON.parse(e.$attrs.id);
            _this.chooseDepartmentName = chooseDepartment.departmentName;
            if(chooseDepartment.departmentName==='全部'){
              _this.chooseDepartmentId = "";
              _this.chooseDepartmentUserId = "";
              _this.chooseDepartmentName = "全部";
              _this.chooseDepartmentTruName = "全部";
              _this.departmentAllUserArray = _this.departmentAllUser;
            }else{                                        //重新获取专业的人员
              _this.chooseDepartmentId = chooseDepartment.id;

              let newDepartmentUserArray = [];
              for(let i=0 ;i<_this.departmentAllUser.length;i++){
                if(_this.departmentAllUser[i].departmentId === chooseDepartment.id){
                  newDepartmentUserArray.push(_this.departmentAllUser[i]);
                }
              }
              newDepartmentUserArray.push({
                trueName:"全部"
              });

              _this.chooseDepartmentUserId = "";
              _this.chooseDepartmentTruName = "全部";
              _this.departmentAllUserArray = newDepartmentUserArray;
            }
            _this.getTask();
          },

          //选择人员
          chooseDepartmentUser:function(e){
            _this = this;
            let chooseDepartmentUser = JSON.parse(e.$attrs.id);
            console.log("选中的人",chooseDepartmentUser);
            _this.chooseDepartmentTruName = chooseDepartmentUser.trueName;
            if(chooseDepartmentUser.trueName === "全部"){
              _this.chooseDepartmentUserId = "";
            }else{
              _this.chooseDepartmentUserId = chooseDepartmentUser.userId;
              _this.chooseDepartmentId = chooseDepartmentUser.departmentId;
             for(let i = 0;i<_this.departmentArray.length;i++){
                if(_this.departmentArray[i].id === _this.chooseDepartmentId){
                  _this.chooseDepartmentName = _this.departmentArray[i].departmentName
                }
             }

            }
            _this.getTask();
          },


          //获取任务信息的函数
          getTask:function () {
            _this = this;
            _this.isLoading = true;
            console.log("查询的条件",{
              projectId:_this.chooseProjectId,
              sprintId:_this.chooseSprintId,
              taskExecuteUserId:_this.chooseDepartmentUserId,
              departmentId:_this.chooseDepartmentId,
            });

            this.axios.post(taskQuery,{
              projectId:_this.chooseProjectId,
              sprintId:_this.chooseSprintId,
              taskExecuteUserId:_this.chooseDepartmentUserId,
              departmentId:_this.chooseDepartmentId,
              pageNum:0,
              pageSize:1000
            })
              .then(res=>{
                console.log("查询到的任务",res);
                _this.isLoading = false;
                if(res.data.code===200){
                  let taskArray = res.data.data.records;
                  let tableData = [];
                  console.log(taskArray.length);
                  if(taskArray.length){
                    for(let i = 0;i<taskArray.length;i++){
                      taskArray[i].taskChargeTrueName = _this.userInfo.tureName;
                      switch (taskArray[i].taskState) {
                        case 0 :
                           taskArray[i].taskStateName = '未开始';
                              break;
                        case 1 :
                           taskArray[i].taskStateName = '完成';
                           break;
                        case 2:
                           taskArray[i].taskStateName = '中止';
                           break;
                        case 3:
                           taskArray[i].taskStateName = '进行中';
                           break;
                        default:
                          break;
                      }
                      if(i<10&&taskArray[i]){
                        tableData.push(taskArray[i]);
                      }
                    }
                       if(taskArray.length<=10){
                         _this.pageCount = 1;
                       }else{
                         _this.pageCount = Math.ceil(taskArray.length/10);
                         console.log(_this.pageCount)
                       }
                     _this.tableData = tableData;
                     _this.allTask = taskArray;
                  }else{
                    _this.pageCount = 0;
                    _this.allTask = taskArray;
                    _this.tableData = [];
                  }
                }
              })
              .catch(Error=>{
                console.log(Error)
              })

          },

          //分页显示
          pageChange:function (e) {
            _this = this;
            let currentPage = e;
            let tableData = [];
            for(let i = (currentPage-1)*10;i<currentPage*10;i++){
              if(_this.allTask[i]){
                tableData.push(_this.allTask[i]);
              }
            }
            _this.tableData = tableData;
          },

          //任务的编辑
          handleEdit(index, row) {
            _this = this;
            console.log(index, row);
            let editTask = row;
            _this.drawer = true;
            _this.taskForm = editTask;
            _this.editorTaskId = editTask.id;
          },

          //单任务删除
          handleDelete(index, row) {
            console.log(index, row);
            let deleteTaskId = row.id;
            this.$confirm('将删除此任务，是否继续?','提示',{
                 confirmButtonText:'删除',
                 cancelButtonText:"取消",
                 type:'warning'
            })
              .then(()=>{
                 _this.axios.post(taskDeleteBatch,[deleteTaskId])
                   .then(data=>{
                     console.log("删除成功",data);
                     let newTableData = [];
                     for(let i = 0;i<_this.tableData.length;i++){
                       if(_this.tableData[i].id!==deleteTaskId){
                         newTableData[i] = _this.tableData[i];
                       }
                     }
                     _this.tableData = newTableData;
                     _this.$message({
                       type:'success',
                       message:"删除成功",
                     });
                   })
                   .catch(Error=>{
                     console.log(Error);
                     _this.$message({
                       type:"warning",
                       message:"删除失败，网络错误，请稍后重试"
                     })
                   })
              })
              .catch(()=>{
                _this.$message({
                  type:"warning",
                  message:"已取消删除"
                })
              })
          },


          //提交修改
          onSubmit() {
            _this = this;
            _this.isFormLoading = true;
            this.axios.post(taskQuery,{
              id:_this.editorTaskId
            })
              .then(res=>{
                console.log("修改之前这个任务",res);
                let preTask = res.data.data.records[0];
                let newActualWorkingHours = 0;
                let newLastChangeStr = "";
                let newTaskPredictTime = 0;
                console.log("提交修改的",_this.taskForm.actualWorkingHours,_this.taskForm.taskPredictTime
                  ,_this.taskForm.taskOrder,_this.taskForm.taskName);
                if(_this.taskForm.actualWorkingHours===''||!_this.taskForm.taskPredictTime
                   ||!_this.taskForm.taskOrder||!_this.taskForm.taskName
                ){
                  _this.$alert("请勿输入空值");
                  _this.isFormLoading = false;
                }else{    //对实际工时和预估工时进行处理
                  newActualWorkingHours = parseFloat(_this.taskForm.actualWorkingHours);

                  switch (_this.taskForm.taskStateName) {
                    case "未开始":
                      _this.taskForm.taskState = 0;
                      break;
                    case "完成":
                      _this.taskForm.taskState = 1;
                      break;
                    case "中止":
                      _this.taskForm.taskState = 2;
                      break;
                    case "进行中":
                      _this.taskForm.taskState = 3;
                      break;
                    default:
                      break;
                  }
                  console.log(_this.taskForm.taskState);
                  if(parseFloat(_this.taskForm.taskPredictTime)>parseFloat(preTask.taskPredictTime)){
                    let resTime = parseFloat(_this.taskForm.taskPredictTime)-parseFloat(preTask.taskPredictTime);
                    newTaskPredictTime = parseFloat(_this.taskForm.taskPredictTime);
                    newLastChangeStr = preTask.lastChangeStr+'+'+resTime;
                  }else if(parseFloat(_this.taskForm.taskPredictTime)<parseFloat(preTask.taskPredictTime)){
                    let resTime =  parseFloat(preTask.taskPredictTime) - (_this.taskForm.taskPredictTime);
                    newTaskPredictTime = parseFloat(_this.taskForm.taskPredictTime);
                    newLastChangeStr = preTask.lastChangeStr+'-'+resTime;
                  }else{
                    newTaskPredictTime = parseFloat(preTask.taskPredictTime)
                  }
                  _this.axios.post(taskUpdateBatch,[{
                    id:_this.editorTaskId,
                    actualWorkingHours:newActualWorkingHours,
                    taskName:_this.taskForm.taskName,
                    taskOrder:_this.taskForm.taskOrder,
                    lastChangeStr:newLastChangeStr,
                    taskPredictTime:newTaskPredictTime,
                    taskPriority: _this.taskForm.taskPriority,
                    taskState: _this.taskForm.taskState
                  }])
                    .then(data=>{
                       console.log("更新成功",data);
                       _this.isFormLoading = false;
                       _this.drawer = false;
                    })
                    .catch(Error=>{
                      console.log(Error)
                    })
                }
              })
              .catch(Error=>{
                console.log(Error)
              })
          },

          //新增任务
          addNewTask:function () {
            _this = this;
            _this.addTaskDrawer = true;
          },

          //提交新增任务
          onSubmitTask:function () {
            _this = this;
            if(_this.newTaskForm.taskPredictTime&&_this.newTaskForm.taskPriority
              &&_this.newTaskForm.taskName
            ){
              console.log("选择的",_this.chooseProjectId,_this.chooseSprintId,_this.chooseDepartmentId,_this.chooseDepartmentUserId);
              _this.newTaskForm.lastChangeStr = _this.newTaskForm.taskPredictTime.toString();
              if(_this.chooseProjectId&&_this.chooseSprintId&&_this.chooseDepartmentId&&_this.chooseDepartmentUserId){
                 _this.axios.post(taskQuery,{
                    projectId:_this.chooseProjectId,
                    sprintId:_this.chooseSprintId,
                    departmentId:_this.chooseDepartmentId,
                    pageNum:0,
                    pageSize:100000
                 })
                   .then(res=>{
                     if(res.data.code===200){
                       let length = parseInt(res.data.data.records.length);
                       let taskOrder;
                       let  Num = "";
                       //console.log("新增任务的序号条件",_this.departmentArray,_this.chooseDepartmentId);
                       for(let i = 0;i<_this.departmentArray.length;i++){
                         if(_this.departmentArray[i].id === parseInt(_this.chooseDepartmentId)){
                           Num = _this.departmentArray[i].departmentNum;
                         }
                       }
                       if(length<9){
                         taskOrder = Num+'0'+(length+1);
                       }else{
                         taskOrder = Num+(length+1);
                       }
                       let newTask = {
                         taskOrder:taskOrder,
                         taskName:_this.newTaskForm.taskName,
                         taskPredictTime:_this.newTaskForm.taskPredictTime,
                         lastChangeStr:_this.newTaskForm.lastChangeStr,
                         projectId:_this.chooseProjectId,
                         sprintId:_this.chooseSprintId,
                         departmentId:_this.chooseDepartmentId,
                         taskExecuteUserId:_this.chooseDepartmentUserId,
                         taskChargeUserId:_this.userInfo.id,
                         taskPriority:parseInt(_this.newTaskForm.taskPriority),
                         isReview:1,
                       };
                       _this.isFormLoading = true;
                       _this.axios.post(taskAdd,newTask)
                         .then(res=>{
                           console.log("新增成功",res);
                           _this.isFormLoading = false;
                           _this.addTaskDrawer = false;
                           _this.$message({
                             type:'success',
                             message:"新增成功"
                           });
                           _this.getTask();
                         })
                         .catch(Error=>{
                           console.log(Error);
                           _this.isFormLoading = false;
                           _this.addTaskDrawer = false;
                           _this.$message({
                             type:"info",
                             message:"网络错误,请稍后重试"
                           })
                         })
                      }
                   })
              }else{
                _this.$alert("请先选择所在的当前项目、当前冲刺、当前专业、当前人员","注意")
              }
            }else{
              _this.$alert("请完善新增任务的信息","注意")
            }
          },


          //实现根据任务序号搜索任务
          queryTask:function () {
             _this = this;
             let search = _this.search;
             let newTableData = [];
             let reg = '/^'+search.toUpperCase()+'/g';
             let reg2 = '/^'+search.toUpperCase()+'/g';
             for(let i = 0;i<_this.allTask.length;i++){
               if(eval(reg).test(_this.allTask[i].taskOrder)||eval(reg2).test(_this.allTask[i].taskOrder)){
                 newTableData.push(_this.allTask[i])
               }
             }
             _this.tableData = newTableData;
          },



          //对任务进行导入
          importTask:function () {
            _this = this;
            if(_this.chooseProjectId&&_this.chooseSprintId){
              _this.importTaskDrawer = true;
            }else{
              _this.$alert('请先选择当前所在的项目还有冲刺','注意');
            }
          },


            changeFile:function(file,fileList){
              console.log("改变选择",file,file.raw);
              console.log("选择2",fileList);
              this.form.file = file.raw;
              console.log("具体的文件",this.form.file)
            },

            handleExceed:function(files,filesList){
              this.$message.warning(`本次限制上传1个文件，本次共选择了${files.length}`)
            },

            failUpload:function(error){
               console.log("上传失败",error)
            },

            submitUpload() {
              _this = this;
              let year = new Date().getFullYear();
              let formData = new FormData();
              formData.append("projectId",_this.chooseProjectId) ;
              formData.append("sprintId",_this.chooseSprintId);
              formData.append("year",year);
              formData.append("file",_this.form.file);
              console.log("上传的参数",formData);
              const uploadLoading = _this.$loading({
                text:"文件上传中请稍后...",
                lock:true,
                spinner:'el-icon-loading',
                background: 'rgba(0, 0, 0, 0.7)'
              });
              _this.axios.post(importTaskData,formData)
                .then(req=>{
                  console.log(req);
                  uploadLoading.close();
                  if(req.status===200){
                      _this.$message({
                        type:'success',
                        message:"导入成功"
                      });
                      _this.importTaskDrawer = false;
                      _this.form = {   //重置
                        projectId:"",
                        sprintId:"",
                        year:"",
                        file:""
                      };
                      _this.fileList = [];
                      _this.getTask();
                    }
                })
                .catch(Error=>{
                  console.log(Error);
                   uploadLoading.close();
                   _this.$message({
                     type:'warning',
                     message:"网络错误，上传失败，请稍后重试"
                   })
                })
            },

            //批量下载项目下冲刺的任务
            downLoadExcel:function(){
               _this = this;
                let url = `${_this.taskDownLoadExcel}?projectId=${_this.chooseProjectId}&sprintId=${_this.chooseSprintId}&departmentId=${_this.chooseDepartmentId}&taskExecuteUserId=${_this.chooseDepartmentUserId}&pageNum=0&pageSize=1000000`;
               _this.axios({
                 method:'get',
                 url:url,
                 headers:{

                 },
                 data:{
                 },
                 responseType:'blob',
               }).then(res=>{
                 console.log("下载的",res);
                 const link = document.createElement('a');
                 const blob = new Blob([res.data],{type:'application/vnd.ms-excel'});
                 link.style.display = 'none';
                 link.href = URL.createObjectURL(blob);
                 link.setAttribute('download', `${name}.冲刺任务`);
                 document.body.appendChild(link);
                 link.click();
                 document.body.removeChild(link)
               })
            },


            //更改已选任务
            handleSelectionChange:function(e){
              _this = this;
              _this.chooseTask = e;
            },

          //一键删除已选
          deleteAllChooseTask:function () {
            _this = this;
            let delteTaskArrayId = [];
            for(let i = 0;i<_this.chooseTask.length;i++){
              delteTaskArrayId.push(parseInt(_this.chooseTask[i].id))
            }
            this.$confirm('是否确定删除已选的任务?','提醒',{
              confirmButtonText:"删除",
              cancelButtonText:"取消",
              type:'warning'
            })
              .then(()=>{
                 _this.axios.post(taskDeleteBatch,delteTaskArrayId)
                   .then(data=>{
                     console.log("批量删除成功",data);
                     _this.$message({
                       type:'success',
                       message:"删除成功",
                     });
                     _this.getTask();
                   })
                   .catch(Error=>{
                     console.log(Error);
                     _this.$message({
                       type:"warning",
                       message:"网络错误，请稍后重试"
                     })
                 })
              })
          },




        },
    }
</script>

<style scoped>
  .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
    position: relative;
    display: flex;
    flex-direction: row;
  }

  .el-aside {
    color: #333;
  }
  .el-pagination{
    margin-top: 20px;
  }
  .el-container{

  }

  .avatar{
    height: 60px;
    width: 10%;
    position: absolute;
    top: 0;
    right: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-around;
  }

  .el-dropdown{
    position: absolute;
    z-index: 1;
    left: 88%;
  }
  .avatar span{
    height: 20px;
    text-align: center;
    line-height: 20px;
  }
  .clear-float{
    clear: both;
  }
  .el-image{
     width: 30px;
     height: 30px;
    -webkit-border-radius:50% ;
    -moz-border-radius: 50%;
     border-radius: 50%;
  }

  .detailMessage{
    display: flex;
    flex-direction: row;
    justify-content: space-around;
    align-items: center;
    width: 50%;
    height: 60px;
  }
  .el-tag{
    height: 40px;
    line-height: 40px;
    width: 100px;
    text-align: center;
    font-size: 13px!important;
  }
  .detailFunction{
     display: flex;
     flex-direction: row;
     width: 300px;
     align-items:center;
     margin-left: 50px;
     height: 60px;
  }
  .detailFunction button{
    height: 40px;
    font-size: 13px!important;
  }
  .drawer{
    overflow: scroll;
  }
  .upload-demo{
    width: 60%;
  }

</style>
