import { boot } from 'quasar/wrappers'

const AUTH_URL = process.env.AUTH_URL

export default boot(({ app, router, store }) => {
  const _axios = app.config.globalProperties.$axios
  const _storage = app.config.globalProperties.$storage
  const _store = store
  const _message = app.config.globalProperties.$message

  const login = async (params) => {
    try {
      const { data } = await _axios.post(`${AUTH_URL}/login`, params)
      const respuesta = data.datos
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
      _storage.set('login_local', true)

      initStore()
      let rutaInicial = '/app/'
      if (respuesta.menu.length > 0) {
        rutaInicial += respuesta.menu[0].ruta
      }
      router.push(rutaInicial)
    } catch (error) {
      let mensaje = 'Ocurrio un error desconocido.'
      if (error.response) {
        const { data } = error.response
        mensaje = data.mensaje
      }
      _message.error(mensaje)
    }
  }

  const loginCiudadania = async () => {
    const { data } = await _axios.get(`${process.env.BACKEND_URL}/codigo`)
    if (data.codigo) {
      _storage.set('oauth2_state', data.codigo || null)
      window.location.href = data.url
    }
  }

  const logout = async () => {
    const codigo = _storage.get('oauth2_state')
    const usuario = _storage.get('usuario')
    try {
      if (codigo && usuario) {
        const { data } = await _axios.post(`${process.env.BACKEND_URL}/logout`, { usuario, codigo })
        _storage.set('login_local', false)
        window.location.href = data.url
      }
    } catch (error) {
    }
  }

  const logoutCiudadania = () => {}

  const cleanStore = () => {
    _storage.remove('roles')
    _storage.remove('menu')
    _storage.remove('permisos')
    _storage.remove('token')
    _store.commit('global/setUsuario', {})
    _store.commit('global/setRoles', [])
    _store.commit('global/setMenu', [])
    _store.commit('global/setPermisos', [])
    if (!_storage.get('login_local')) {
      logoutCiudadania()
    }
    _storage.removeUsuario()
    _storage.remove('login_local')
    router.push('/')
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
