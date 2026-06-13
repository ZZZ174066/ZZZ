<template>
  <RouterView />
</template>

<style>
/* 全局自定义消息框样式 */
.custom-message-box {
  border: 3px solid #000000 !important;
  border-radius: 12px !important;
  background: #ffffff !important;
  box-shadow: 0 15px 40px rgba(0, 0, 0, 0.8) !important;
}

.custom-message-box .el-message-box__header {
  background: #000000 !important;
  color: #ffffff !important;
  padding: 15px 30px !important;
  border-radius: 12px !important;
  margin: 10px 10px 0 10px !important;
  text-align: center !important;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.6) !important;
  position: relative !important;
  z-index: 10 !important;
}

.custom-message-box .el-message-box__title {
  color: #ffffff !important;
  font-weight: bold !important;
  font-size: 18px !important;
}

.custom-message-box .el-message-box__content {
  padding: 20px 30px !important;
  background: #ffffff !important;
  position: relative !important;
  z-index: 1 !important;
}

.custom-message-box .el-message-box__message {
  color: #000000 !important;
  font-size: 16px !important;
  margin-left: 0 !important;
  padding-left: 0 !important;
}

.custom-message-box .el-message-box__btns {
  padding: 15px 30px 20px 30px !important;
  background: #ffffff !important;
  border-radius: 0 0 9px 9px !important;
}

.custom-message-box .el-button {
  padding: 8px 16px !important;
  border: 2px solid #000000 !important;
  background: #ffffff !important;
  color: #000000 !important;
  font-weight: bold !important;
  border-radius: 4px !important;
  min-width: 80px !important;
  margin: 0 5px !important;
}

.custom-message-box .el-button--primary {
  background: #000000 !important;
  color: #ffffff !important;
  border-color: #000000 !important;
}

.custom-message-box .el-button:hover {
  background: #000000 !important;
  color: #ffffff !important;
  border-color: #000000 !important;
}

.custom-message-box .el-button--primary:hover {
  background: #333333 !important;
  color: #ffffff !important;
  border-color: #333333 !important;
}

/* 移除默认的叉号 */
.custom-message-box .el-message-box__close {
  display: none !important;
}

/* 隐藏感叹号图标 */
.custom-message-box .el-message-box__status {
  display: none !important;
}
</style>