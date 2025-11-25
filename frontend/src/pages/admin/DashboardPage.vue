<template>
  <q-page class="flex flex-center column q-gap-md">
    <div class="text-h4">Dashboard</div>
    <div class="text-subtitle1">Bienvenido al panel de administración</div>

    <q-btn
      color="primary"
      icon="check_circle"
      label="Verificar Conexión"
      @click="verificarConexion"
      :loading="cargando"
    />
  </q-page>
</template>

<script setup>
import { ref } from 'vue'
import { api } from 'boot/axios'
import { useQuasar } from 'quasar'

defineOptions({
  name: 'DashboardPage'
})

const $q = useQuasar()
const cargando = ref(false)

async function verificarConexion () {
  cargando.value = true
  try {
    const response = await api.get('/verificar-acceso')
    $q.notify({
      color: 'positive',
      message: `Respuesta del servidor: ${response.data.mensaje}`,
      icon: 'check'
    })
  } catch (error) {
    $q.notify({
      color: 'negative',
      message: 'Error al conectar con el servidor',
      icon: 'report_problem'
    })
    console.error(error)
  } finally {
    cargando.value = false
  }
}
</script>
