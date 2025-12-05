
const routes = [
  {
    path: '/',
    component: () => import('layouts/PanelPrincipal.vue'),
    children: [
      { path: '', redirect: '/admin/dashboard' }, // Redirección inicial
      // Administración
      { path: 'admin/dashboard', component: () => import('pages/admin/DashboardPage.vue') },
      { path: 'admin/usuarios', component: () => import('pages/admin/UsuariosPage.vue') },
      // Infraestructura
      { path: 'infra/municipios', component: () => import('src/pages/infra/municipios/page.municipios.vue') },
      { path: 'infra/sedes', component: () => import('src/pages/infra/sedes/page.sedes.vue') },
      { path: 'infra/redes', component: () => import('pages/infra/RedesPage.vue') },
      // Material
      { path: 'material/tipos', component: () => import('pages/material/tipos/page.tipos.vue') },
      { path: 'material/equipos', component: () => import('pages/material/equipos/page.equipos.vue') }
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
