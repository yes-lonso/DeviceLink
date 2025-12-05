<template>
   <VistaTabla
      row-key="id"
      title="Equipos de Red"
      :rows="modelo.rows"
      :columns="control.columns"
      :actions="modelo.actions"
      :row-actions="modelo.rowActions"
      :loading="modelo.loading"
      :pagination="modelo.pagination"
      v-model:selected="modelo.selected"
      @request="control.onRequest"
   >
   </VistaTabla>
   <DialogEquipo
      v-model:show="modelo.showDialog"
      :equipo="modelo.equipo"
      @save="control.onGuardarEquipo"
   />
</template>

<script setup lang="ts">
import VistaTabla from 'components/VistaTabla/VistaTabla.vue';
import { useEquipos } from './setup.equipos';
import DialogEquipo from './dialog.equipo.vue';

const { modelo, control } = useEquipos();
</script>
