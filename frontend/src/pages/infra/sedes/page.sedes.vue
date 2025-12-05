<template>
   <VistaTabla
      row-key="id"
      title="Sedes"
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
   <DialogSede
      v-model:show="modelo.showDialog"
      :sede="modelo.sede"
      @save="control.onGuardarSede"
   />
</template>

<script setup lang="ts">
import VistaTabla from 'src/components/VistaTabla/VistaTabla.vue';
import { useSedes } from './setup.sedes';
import DialogSede from './dialog.sedes.vue';

const { modelo, control } = useSedes();
</script>
