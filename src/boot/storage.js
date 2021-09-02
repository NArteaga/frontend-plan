import { boot } from 'quasar/wrappers'
const prefix = 'app'

const codificar = (value) => {
  return window.btoa(value)
}

const decodificar = (value) => {
  return window.atob(value)
}

const storage = {
  get (keyName) {
    if (localStorage.getItem(codificar(`${prefix}_${keyName}`))) {
      return JSON.parse(decodificar(localStorage.getItem(codificar(`${prefix}_${keyName}`))))
    }
    return null
  },
  existUsuario () {
    return this.exist(codificar('usuario'))
  },
  removeUsuario () {
    this.remove(codificar('usuario'))
  },
  remove (key) {
    localStorage.removeItem(codificar(`${prefix}_${key}`))
  },
  destroy (key) {
    this.remove(codificar(`${prefix}_${key}`))
  },
  set (keyName, keyValue) {
    localStorage.setItem(codificar(`${prefix}_${keyName}`), codificar(JSON.stringify(keyValue)))
  },
  setUsuario (usuario) {
    this.set('usuario', usuario)
  },
  getUsuario () {
    return this.get('usuario')
  },
  exist (keyName) {
    const existe = localStorage.getItem(codificar(`${prefix}_${keyName}`))
    if (existe) {
      return JSON.parse(decodificar(existe))
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
