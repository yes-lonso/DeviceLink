<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title>
          {{ description }}
        </q-toolbar-title>
       
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="leftDrawerOpen"
      show-if-above
      bordered
    >
      <q-list>
        <q-item-label header>
          Menú Principal
        </q-item-label>

        <!-- Administración -->
        <q-expansion-item
          icon="admin_panel_settings"
          label="Administración"
          :content-inset-level="0.5"
          v-model="adminOpen"
        >
          <q-item clickable v-ripple to="/admin/dashboard" active-class="bg-primary text-white">
            <q-item-section avatar>
              <q-icon name="dashboard" />
            </q-item-section>
            <q-item-section>Dashboard</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/admin/usuarios" active-class="bg-primary text-white">
            <q-item-section avatar>
              <q-icon name="people" />
            </q-item-section>
            <q-item-section>Usuarios</q-item-section>
          </q-item>
        </q-expansion-item>

        <!-- Infraestructura -->
        <q-expansion-item
          icon="domain"
          label="Infraestructura"
          :content-inset-level="0.5"
          v-model="infraOpen"
        >
          <q-item clickable v-ripple to="/infra/municipios" active-class="bg-primary text-white">
            <q-item-section avatar>
              <q-icon name="location_city" />
            </q-item-section>
            <q-item-section>Municipios</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/infra/sedes" active-class="bg-primary text-white">
            <q-item-section avatar>
              <q-icon name="business" />
            </q-item-section>
            <q-item-section>Sedes</q-item-section>
          </q-item>

          <q-item clickable v-ripple to="/infra/redes" active-class="bg-primary text-white">
            <q-item-section avatar>
              <q-icon name="lan" />
            </q-item-section>
            <q-item-section>Redes</q-item-section>
          </q-item>
        </q-expansion-item>

        <!-- Material -->
        <q-expansion-item
          icon="devices"
          label="Material"
          :content-inset-level="0.5"
          v-model="materialOpen"
        >
          <q-item clickable v-ripple to="/material/equipos" active-class="bg-primary text-white">
            <q-item-section avatar>
              <q-icon name="computer" />
            </q-item-section>
            <q-item-section>Equipos</q-item-section>
          </q-item>
        </q-expansion-item>

      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script setup>
import { ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import pkg from '../../package.json'

defineOptions({
  name: 'PanelPrincipal'
})

const leftDrawerOpen = ref(false)
const route = useRoute()
const description = pkg.description

const adminOpen = ref(false)
const infraOpen = ref(false)
const materialOpen = ref(false)

function toggleLeftDrawer () {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

watch(() => route.path, (path) => {
  if (path.startsWith('/admin')) adminOpen.value = true
  if (path.startsWith('/infra')) infraOpen.value = true
  if (path.startsWith('/material')) materialOpen.value = true
}, { immediate: true })
</script>
