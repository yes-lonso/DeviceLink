
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
      { path: 'infra/municipios', component: () => import('src/pages/infra/municipios/municipios.page.vue') },
      { path: 'infra/sedes', component: () => import('pages/infra/SedesPage.vue') },
      { path: 'infra/redes', component: () => import('pages/infra/RedesPage.vue') },
      // Material
      { path: 'material/equipos', component: () => import('pages/material/EquiposPage.vue') }
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
