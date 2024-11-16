import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const count = ref(0)
  const replace = (data) => {
    if (data > count.value) {
      count.value = data
    }
  }
  return { count, replace }
}, {
  persist: true
})
