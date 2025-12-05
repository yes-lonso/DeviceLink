<template>
   <VistaTabla
      row-key="id"
      title="Tipos de Material"
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
   <DialogTipo
      v-model:show="modelo.showDialog"
      :tipo="modelo.tipo"
      @save="control.onGuardarTipo"
   />
</template>

<script setup lang="ts">
import VistaTabla from 'components/VistaTabla/VistaTabla.vue';
import { useTipos } from './setup.tipos';
import DialogTipo from './dialog.tipo.vue';

const { modelo, control } = useTipos();
</script>
