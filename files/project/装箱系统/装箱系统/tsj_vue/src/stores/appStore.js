import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useAppStore = defineStore('app', () => {
  const currentTab = ref('items')

  function setCurrentTab(tab) {
    currentTab.value = tab
  }

  return {
    currentTab,
    setCurrentTab
  }
})

