const host = "http://120.79.49.245:7377";
const userQuery = `${host}/user/query`;
const userProjectQuery = `${host}/userProjectRole/query`;
const projectQuery = `${host}/project/query`;
const sprintQuery = `${host}/sprint/query`;
const departmentQueryAll = `${host}/department/queryAll`;
const userProjectDepartmentQuery = `${host}/userprojectdepartment/query`;
const taskAdd = `${host}/task/add`;
const taskQuery = `${host}/task/query`;
const taskDeleteBatch = `${host}/task/deleteBatch`;
const taskUpdateBatch = `${host}/task/updateBatch`;
const dateWorkQuery = `${host}/datework/query`;
const dateWorkUpdateBatch = `${host}/datework/updateBatch`;
const importTaskData = `${host}/task/importTaskData`;
const taskDownLoadExcel = `${host}/task/downloadExcel`;
module.exports = {
  userQuery:userQuery,
  userProjectQuery:userProjectQuery,
  projectQuery:projectQuery,
  sprintQuery:sprintQuery,
  departmentQueryAll:departmentQueryAll,
  userProjectDepartmentQuery:userProjectDepartmentQuery,
  taskAdd:taskAdd,
  taskQuery:taskQuery,
  taskUpdateBatch:taskUpdateBatch,
  taskDeleteBatch:taskDeleteBatch,
  dateWorkUpdateBatch:dateWorkUpdateBatch,
  dateWorkQuery:dateWorkQuery,
  importTaskData:importTaskData,
  taskDownLoadExcel:taskDownLoadExcel
};
