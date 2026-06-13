import { defineStore } from 'pinia'
import { ref } from 'vue'

let confirmResolver = null

export const useUiStore = defineStore('ui', () => {
  const alertVisible = ref(false)
  const alertMessage = ref('')
  const confirmVisible = ref(false)
  const confirmMessage = ref('')
  /** 内嵌方案页生成/装箱进行中：Home 左侧列表等同步禁用 */
  const workspacePackingLocked = ref(false)

  function showAlert(msg) {
    alertMessage.value = String(msg ?? '')
    alertVisible.value = true
  }

  function hideAlert() {
    alertVisible.value = false
  }

  function showConfirm(msg) {
    confirmMessage.value = String(msg ?? '')
    confirmVisible.value = true
    return new Promise((resolve) => {
      confirmResolver = resolve
    })
  }

  function answerConfirm(ok) {
    confirmVisible.value = false
    if (confirmResolver) {
      confirmResolver(!!ok)
      confirmResolver = null
    }
  }

  function setWorkspacePackingLocked(locked) {
    workspacePackingLocked.value = !!locked
  }

  return {
    alertVisible,
    alertMessage,
    confirmVisible,
    confirmMessage,
    workspacePackingLocked,
    showAlert,
    hideAlert,
    showConfirm,
    answerConfirm,
    setWorkspacePackingLocked
  }
})
