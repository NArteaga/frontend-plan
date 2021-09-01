import { boot } from 'quasar/wrappers'

const AUTH_URL = process.env.AUTH_URL

export default boot(({ app, router, store }) => {
  const _http = app.config.globalProperties.$http
  const _storage = app.config.globalProperties.$storage
  const _store = store
  const _message = app.config.globalProperties.$message

  const login = async (params) => {
    try {
      const respuesta = await _http.post(`${AUTH_URL}/login`, params)
      const usuario = {
        usuario: respuesta.usuario,
        nombres: respuesta.nombres,
        primerApellido: respuesta.primerApellido,
        segundoApellido: respuesta.segundoApellido,
        correoElectronico: respuesta.correoElectronico,
        rol: respuesta.roles[0]?.nombre ?? 'Sin rol',
        entidad: respuesta.entidad.nombre
      }
      _storage.setUsuario(usuario)
      _storage.set('roles', respuesta.roles)
      _storage.set('menu', respuesta.menu)
      _storage.set('permisos', respuesta.permisos)
      _storage.set('token', respuesta.token)

      initStore()
      let rutaInicial = '/app/'
      if (respuesta.menu.length > 0) {
        rutaInicial += respuesta.menu[0].ruta
      }
      router.push(rutaInicial)
    } catch (error) {
      _message.error(error.mensaje)
    }
  }

  const loginCiudadania = () => {
  }

  const logout = () => {}

  const logoutCiudadania = () => {}

  const cleanStore = () => {
    _storage.removeUssuario()
    _storage.remove('roles')
    _storage.remove('menu')
    _storage.remove('permisos')
    _storage.remove('token')
    _store.commit('global/setUsuario', {})
    _store.commit('global/setRoles', [])
    _store.commit('global/setMenu', [])
    _store.commit('global/setPermisos', [])
    router.push('/login')
  }

  const initStore = () => {
    _store.commit('global/setUsuario', _storage.getUsuario())
    _store.commit('global/setRoles', _storage.get('roles'))
    _store.commit('global/setMenu', _storage.get('menu'))
    _store.commit('global/setPermisos', _storage.get('permisos'))
  }

  app.provide('auth', {
    cleanStore,
    initStore,
    login,
    loginCiudadania,
    logout,
    logoutCiudadania
  })
})

//
