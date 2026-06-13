<template>
  <RouterView />
  <Teleport to="body">
    <div
      v-if="ui.alertVisible"
      class="ui-overlay"
      role="alertdialog"
      aria-modal="true"
      @click.self="ui.hideAlert"
    >
      <div class="ui-dialog ui-dialog--mint" @click.stop>
        <div class="ui-dialog__title">提示</div>
        <div class="ui-dialog__body">{{ ui.alertMessage }}</div>
        <div class="ui-dialog__footer">
          <button type="button" class="ui-dialog__btn ui-dialog__btn--primary" @click="ui.hideAlert">
            确定
          </button>
        </div>
      </div>
    </div>
    <div v-if="ui.confirmVisible" class="ui-overlay" role="dialog" aria-modal="true" @click.self="ui.answerConfirm(false)">
      <div class="ui-dialog ui-dialog--mint" @click.stop>
        <div class="ui-dialog__title">请确认</div>
        <div class="ui-dialog__body">{{ ui.confirmMessage }}</div>
        <div class="ui-dialog__footer ui-dialog__footer--split">
          <button type="button" class="ui-dialog__btn" @click="ui.answerConfirm(false)">取消</button>
          <button type="button" class="ui-dialog__btn ui-dialog__btn--primary" @click="ui.answerConfirm(true)">
            确定
          </button>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useUiStore } from './stores/uiStore'

const ui = useUiStore()
</script>

<style>
:root {
  --ui-mint: #a8e6cf;
  --ui-shadow-sm: 0 2px 8px rgba(0, 0, 0, 0.08);
  --ui-shadow-md: 0 6px 18px rgba(0, 0, 0, 0.12);
  --ui-shadow-lg: 0 14px 40px rgba(0, 0, 0, 0.16);
  /* 与首页「添加」等列表顶栏按钮一致 */
  --ui-add-btn-height: 32px;
  --ui-add-btn-font-size: 12px;
  --ui-add-btn-font-weight: 400;
  --ui-add-btn-radius: 10px;
}

html,
body,
#app {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
  background: #fff;
  color: #000;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* 隐藏滚动条（仍可滚动） */
html {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

html::-webkit-scrollbar,
body::-webkit-scrollbar,
#app::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

* {
  scrollbar-width: none;
  -ms-overflow-style: none;
}

*::-webkit-scrollbar {
  display: none;
  width: 0;
  height: 0;
}

/* 全局对话框（与主界面薄荷绿风格一致） */
.ui-overlay {
  position: fixed;
  inset: 0;
  z-index: 10000;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  background: rgba(0, 0, 0, 0.35);
}

.ui-dialog--mint {
  width: min(420px, 100%);
  max-height: min(80vh, 560px);
  display: flex;
  flex-direction: column;
  background: #fff;
  border: 1px solid #000;
  border-radius: 14px;
  box-shadow: var(--ui-shadow-lg);
  overflow: hidden;
}

.ui-dialog__title {
  padding: 10px 16px;
  background: var(--ui-mint);
  color: #000;
  font-size: var(--ui-add-btn-font-size);
  font-weight: var(--ui-add-btn-font-weight);
  text-align: center;
  border-bottom: 1px solid #000;
}

.ui-dialog__body {
  padding: 16px 18px;
  font-size: var(--ui-add-btn-font-size);
  font-weight: var(--ui-add-btn-font-weight);
  line-height: 1.55;
  color: #111;
  white-space: pre-wrap;
  word-break: break-word;
  overflow-y: auto;
  flex: 1;
  min-height: 0;
}

.ui-dialog__footer {
  padding: 12px 16px 16px;
  display: flex;
  justify-content: center;
  gap: 12px;
  border-top: 1px solid #000;
  background: #fafafa;
}

.ui-dialog__footer--split {
  justify-content: flex-end;
}

.ui-dialog__btn {
  min-width: 72px;
  height: var(--ui-add-btn-height);
  padding: 0 6px;
  border-radius: var(--ui-add-btn-radius);
  border: 1px solid #000;
  background: #fff;
  color: #000;
  font-size: var(--ui-add-btn-font-size);
  font-weight: var(--ui-add-btn-font-weight);
  cursor: pointer;
  box-shadow: var(--ui-shadow-sm);
}

.ui-dialog__btn--primary {
  background: #a8e6cf;
  color: #000;
}

.ui-dialog__btn:hover {
  filter: brightness(0.98);
}

/* 纯黑白主题基础样式（覆盖 Element Plus 的默认圆角/边框色） */
.el-card,
.el-table,
.el-dialog {
  border-radius: 0 !important;
}

.el-table th,
.el-table td {
  border-color: #000 !important;
}

.el-table--border,
.el-table--group {
  border-color: #000 !important;
}

.el-button--primary {
  background-color: #a8e6cf !important;
  border-color: #000000 !important;
  color: #000000 !important;
}

/* 全局自定义消息框样式（与主界面一致） */
.custom-message-box {
  border: 1px solid #000000 !important;
  border-radius: 14px !important;
  background: #ffffff !important;
  box-shadow: var(--ui-shadow-lg) !important;
  overflow: hidden !important;
}

.custom-message-box .el-message-box__header {
  background: var(--ui-mint) !important;
  color: #000000 !important;
  padding: 12px 20px !important;
  border-bottom: 1px solid #000 !important;
  margin: 0 !important;
  text-align: center !important;
  box-shadow: none !important;
  position: relative !important;
  z-index: 10 !important;
}

.custom-message-box .el-message-box__title {
  color: #000000 !important;
  font-weight: var(--ui-add-btn-font-weight) !important;
  font-size: var(--ui-add-btn-font-size) !important;
}

.custom-message-box .el-message-box__content {
  padding: 16px 18px !important;
  background: #ffffff !important;
  position: relative !important;
  z-index: 1 !important;
}

.custom-message-box .el-message-box__message {
  color: #000000 !important;
  font-size: var(--ui-add-btn-font-size) !important;
  font-weight: var(--ui-add-btn-font-weight) !important;
  margin-left: 0 !important;
  padding-left: 0 !important;
}

.custom-message-box .el-message-box__btns {
  padding: 12px 20px 16px !important;
  background: #fafafa !important;
  border-top: 1px solid #000 !important;
  border-radius: 0 !important;
}

.custom-message-box .el-button {
  height: var(--ui-add-btn-height) !important;
  min-height: var(--ui-add-btn-height) !important;
  padding: 0 6px !important;
  border: 1px solid #000000 !important;
  background: #ffffff !important;
  color: #000000 !important;
  font-weight: var(--ui-add-btn-font-weight) !important;
  font-size: var(--ui-add-btn-font-size) !important;
  border-radius: var(--ui-add-btn-radius) !important;
  min-width: 72px !important;
  margin: 0 6px !important;
  box-shadow: var(--ui-shadow-sm) !important;
}

.custom-message-box .el-button--primary {
  background: #a8e6cf !important;
  color: #000000 !important;
  border-color: #000000 !important;
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
