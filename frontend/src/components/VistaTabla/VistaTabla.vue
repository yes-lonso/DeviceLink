<template>
  <q-page class="q-pa-md column" style="height: calc(100vh - 50px); overflow: hidden">
      <Tabla
        ref="tablaRef"
        :rows="rows"
        :columns="columns"
        :loading="loading"
        :pagination="pagination"
        :title="title"        
        :row-key="rowKey"
        :selected="selected"
        :row-actions="rowActions"
        @update:selected="$emit('update:selected', $event)"
        @request="onRequest"
        @row-click="onRowClick"
      >
        <template v-slot:top-left>
           <Bar :actions="actions" />
        </template>

        <!-- Pass through all slots -->
        <template v-for="(_, slot) in $slots" v-slot:[slot]="scope">
          <slot :name="slot" v-bind="scope" />
        </template>
      </Tabla>
  </q-page>
</template>

<script setup lang="ts">
import { PropType, ref } from 'vue';
import { QTableProps } from 'quasar';
import Bar from './Bar.vue';
import { Action } from './types';
import Tabla from './Tabla.vue';

const props = defineProps({
  rows: {
    type: Array,
    default: () => [],
  },
  columns: {
    type: Array as PropType<QTableProps['columns']>,
    default: () => [],
  },
  actions: {
    type: Array as PropType<Action[]>,
    default: () => [],
  },
  loading: {
    type: Boolean,
    default: false,
  },
  pagination: {
    type: Object as PropType<QTableProps['pagination']>,
    default: () => ({}),
  },
  title: {
    type: String,
    default: '',
  },
  selected: {
    type: Array,
    default: () => [],
  },
  rowKey: {
    type: String,
    default: 'id',
  },
  rowActions: {
    type: Array as PropType<Action[]>,
    default: () => [],
  },
});

const emit = defineEmits(['request', 'row-click', 'update:selected']);

const onRequest = () => {
  emit('request');
};

const onRowClick = (row: any) => {
  emit('row-click', row);
};

const tablaRef = ref(null);

const exportTable = () => {
  if (tablaRef.value) {
    (tablaRef.value as any).exportTable();
  }
};

// Exponemos los métodos para que puedan ser accedidos desde el componente padre
defineExpose({
  exportTable
});
</script>
