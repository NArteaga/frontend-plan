import { getCurrentInstance } from 'vue'

const usePlugins = () => {
  const app = getCurrentInstance()
  const Storage = app.appContext.config.globalProperties.$storage
  const Message = app.appContext.config.globalProperties.$message
  const Http = app.appContext.config.globalProperties.$http
  const Auth = app.appContext.config.globalProperties.$auth
  const Confirm = app.appContext.config.globalProperties.$confirm

  return {
    Message,
    Auth,
    Http,
    Storage,
    Confirm
  }
}

export default usePlugins
