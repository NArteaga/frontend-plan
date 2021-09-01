const _storage = window.localStorage
const prefix = 'app'
const guardLogin = (to, from, next) => {
  const menu = _storage.getItem(`${prefix}_menu`)
  if (_storage.getItem(`${prefix}_token`) && menu && _storage.getItem(`${prefix}_usuario`)) {
    if (from.path.includes('/app/')) {
      next({ path: `${JSON.parse(menu)[0].ruta}`, replace: true })
    } else {
      next({ path: `/app/${JSON.parse(menu)[0].ruta}`, replace: true })
    }
  } else {
    next()
  }
}

const guardApp = (to, from, next) => {
  if (_storage.getItem(`${prefix}_token`)) {
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
      { path: 'dashboard', name: 'dashboard', component: () => import('pages/Dashboard.vue') }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
