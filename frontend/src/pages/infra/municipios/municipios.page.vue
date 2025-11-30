<template>
  <VistaTabla
    title="Municipios"
    :rows="rows"
    :columns="columns"
    :actions="actions"
    :loading="loading"
    :pagination="pagination"
    row-key="id"
    v-model:selected="selected"
    @request="onRequest"
    @row-click="onRowClick"
  />
</template>

<script setup lang="ts">
import VistaTabla from 'components/VistaTabla/VistaTabla.vue';
import { useMunicipios } from './municipios.setup';

const {
  rows,
  columns,
  actions,
  loading,
  pagination,
  selected,
  onRequest,
  onRowClick,
} = useMunicipios();
</script>
