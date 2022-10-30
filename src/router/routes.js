const _storage = window.localStorage
const prefix = 'app'

const codificar = (value) => {
  if (process.env.NODE_ENV === 'development') return value

  return window.btoa(value)
}

const decodificar = (value) => {
  if (process.env.NODE_ENV === 'development') return value

  return window.atob(value)
}

const guardLogin = (to, from, next) => {
  const menu = _storage.getItem(codificar(`${prefix}_menu`))
  if (_storage.getItem(codificar(`${prefix}_token`)) && menu && _storage.getItem(codificar(`${prefix}_usuario`))) {
    if (from.path.includes('/app/')) {
      next({ path: `${JSON.parse(decodificar(menu))[0].ruta}`, replace: true })
    } else {
      next({ path: `/app/${JSON.parse(decodificar(menu))[0].ruta}`, replace: true })
    }
  } else {
    next()
  }
}

const guardApp = (to, from, next) => {
  if (_storage.getItem(codificar(`${prefix}_token`))) {
    next()
  } else {
    _storage.clear()
    next('/')
  }
}

const routes = [
  {
    path: '/',
    component: () => import('layouts/OutLoginLayout.vue'),
    beforeEnter: guardLogin,
    children: [
      { path: '', component: () => import('pages/Login.vue') }
    ]
  },
  {
    path: '/app/',
    component: () => import('layouts/MainLayout.vue'),
    beforeEnter: guardApp,
    children: [
      { path: 'dashboard', name: 'dashboard', component: () => import('pages/Dashboard.vue') },
      { path: 'entidades', name: 'entidades', component: () => import('pages/Entidades.vue') },
      { path: 'entidades/:id', name: 'entidad-usuario', component: () => import('pages/Usuarios.vue') },
      { path: 'menus', name: 'menus', component: () => import('pages/Menus.vue') },
      { path: 'roles', name: 'roles', component: () => import('pages/Roles.vue') },
      { path: 'usuarios', name: 'usuarios', component: () => import('pages/Usuarios.vue') },
      { path: 'parametros', name: 'parametros', component: () => import('pages/Parametros.vue') },
      { path: 'interoperabilidad', name: 'interoperabilidad', component: () => import('pages/Interoperabilidad.vue') },
      { path: 'planificacion', name: 'planificacion', component: () => import('pages/Planificacion.vue') },
      { path: 'entidades/plan/:id', name: 'formulacionPoa', component: () => import('components/Planificacion/Formulacion/Formulacion.vue') },
      { path: 'red-funcional/solicitudes/seguimiento', name: 'rf_admin_solicitudes', component: () => import('pages/RFuncional/Administrador/Solicitudes.vue') },
      { path: 'red-funcional/solicitudes', name: 'rf_solicitudes', component: () => import('pages/RFuncional/Funcionario/SolicitudesPorEntidad.vue') }

    ]
  },
  {
    path: '/ciudadania/',
    component: () => import('layouts/CiudadaniaLayout.vue'),
    children: [
      { path: 'aprobar-documento', name: 'aprobar', component: () => import('pages/CiudadaniaDigital/Firma.vue') },
      { path: 'documento-aprobado', name: 'aprobado', component: () => import('pages/CiudadaniaDigital/AprobacionDocumento.vue') },
      {
        path: 'login',
        name: 'login-ciudadania',
        component: () => import('src/pages/CiudadaniaDigital/Login')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
