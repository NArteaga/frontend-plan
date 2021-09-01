import { boot } from 'quasar/wrappers'
const prefix = 'app'

const storage = {
  get (keyName) {
    if (localStorage.getItem(`${prefix}_${keyName}`)) {
      return JSON.parse(localStorage.getItem(`${prefix}_${keyName}`))
    }
    return null
  },
  existUsuario () {
    return this.exist('usuario')
  },
  removeUsuario () {
    this.remove('usuario')
  },
  remove (key) {
    localStorage.removeItem(`${prefix}_${key}`)
  },
  destroy (key) {
    this.remove(`${prefix}_${key}`)
  },
  set (keyName, keyValue) {
    localStorage.setItem(`${prefix}_${keyName}`, JSON.stringify(keyValue))
  },
  setUsuario (usuario) {
    this.set('usuario', usuario)
  },
  getUsuario () {
    return this.get('usuario')
  },
  exist (keyName) {
    const existe = localStorage.getItem(`${prefix}_${keyName}`)
    if (existe) {
      return JSON.parse(existe)
    } else {
      return false
    }
  },
  clearAll () {
    localStorage.clear()
  }
}

export default boot(({ app }) => {
  app.config.globalProperties.$storage = storage
  app.provide('storage', storage)
})

export { storage }
