<template>
   <q-table
      ref="tableRef"
      :rows="rows"
      :columns="visibleColumns"
      :loading="loading"
      :pagination="pagination"
      :title="title"
      :row-key="rowKey"
      class="my-sticky-header-table full-height"
      flat
      bordered
      hide-pagination
      :filter="filter"
      :filter-method="customFilter"
      @request="onRequest"
   >
      <!-- Slot superior derecho para búsqueda y rehacer la consulta -->
      <template v-slot:top-right>
         <q-input
            dense
            debounce="300"
            v-model="filter"
            placeholder="Buscar"
            :disable="noHayDatos"
         >
            <template v-slot:append>
               <q-icon name="search" />
            </template>
         </q-input>
         <q-btn
            flat
            round
            dense
            icon="download"
            class="q-ml-sm"
            @click="exportTable"
            :disable="noHayDatos"
         >
            <q-tooltip>Exportar CSV</q-tooltip>
         </q-btn>
         <q-btn
            flat
            round
            dense
            icon="refresh"
            class="q-ml-sm"
            @click="onRequest"
         >
            <q-tooltip>Rehacer la consulta</q-tooltip>
         </q-btn>
      </template>

      <!-- Slot inferior personalizado para conteo de filas -->
      <template v-slot:bottom>
         <div class="full-width text-right q-pa-sm">
            Total: {{ tableRef?.computedRows?.length || 0 }}
         </div>
      </template>

      <!-- Slot de cuerpo personalizado para selección -->
      <template v-slot:body="props">
         <q-tr
            :props="props"
            @click="onRowClick($event, props.row)"
            :class="{ 'bg-blue-1': isSelected(props.row), 'cursor-pointer': true }"
         >
            <q-td
               v-for="col in props.cols"
               :key="col.name"
               :props="props"
               class="monospace-data"
            >
               <!-- Verificar slot específico de columna -->
               <slot
                  v-if="$slots[`body-cell-${col.name}`]"
                  :name="`body-cell-${col.name}`"
                  v-bind="props"
               />
               <!-- Renderizado por defecto -->
               <template v-else>
                  <div v-if="col.name === 'actions' && rowActions.length > 0">
                     <q-btn
                        flat
                        round
                        dense
                        icon="more_vert"
                        @click.stop="onActionMenuClick(props.row)"
                     >
                        <q-menu>
                           <q-list style="min-width: 100px">
                              <q-item
                                 v-for="(action, index) in rowActions"
                                 :key="index"
                                 clickable
                                 v-close-popup
                                 @click="action.handler(props.row)"
                              >
                                 <q-item-section
                                    avatar
                                    v-if="action.icon"
                                 >
                                    <q-icon
                                       :name="action.icon"
                                       :color="action.color"
                                    />
                                 </q-item-section>
                                 <q-item-section>{{ action.label }}</q-item-section>
                              </q-item>
                           </q-list>
                        </q-menu>
                     </q-btn>
                  </div>
                  <div v-else>
                     {{ col.value }}
                  </div>
               </template>
            </q-td>
         </q-tr>
      </template>

      <!-- Pasar otros slots (top, bottom, etc) -->
      <template
         v-for="(_, slot) in $slots"
         v-slot:[slot]="scope"
      >
         <slot
            v-if="slot !== 'body' && !String(slot).startsWith('body-cell-')"
            :name="slot"
            v-bind="scope"
         />
      </template>

      <template v-slot:loading>
         <q-inner-loading
            showing
            color="primary"
         />
      </template>
   </q-table>
</template>

<script setup lang="ts">
import { PropType, ref, computed } from 'vue';
import { QTableProps, exportFile } from 'quasar';

const props = defineProps({
   rows: {
      type: Array,
      default: () => [],
   },
   columns: {
      type: Array as PropType<QTableProps['columns']>,
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
      type: Array as PropType<any[]>,
      default: () => [],
   },
});

const emit = defineEmits(['request', 'row-click', 'update:selected']);

const tableRef = ref(null);
const filter = ref('');

const visibleColumns = computed(() => {
   return props.columns.filter((col: any) => col.name !== 'id');
});

const noHayDatos = computed(() => props.rows.length === 0);

const onRequest = () => {
   filter.value = '';
   emit('request');
};

const isSelected = (row: any) => {
   return props.selected.some((r: any) => r[props.rowKey] === row[props.rowKey]);
};

const customFilter = (
   rows: any[],
   terms: string,
   cols: any[],
   getCellValue: (col: any, row: any) => any,
) => {
   const lowerTerms = terms
      ? terms
           .normalize('NFD')
           .replace(/[\u0300-\u036f]/g, '')
           .toLowerCase()
      : '';
   return rows.filter((row) => {
      return cols.some((col) => {
         const val = getCellValue(col, row);
         const strVal = val === null || val === undefined ? '' : String(val);
         return strVal
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .toLowerCase()
            .includes(lowerTerms);
      });
   });
};

const onRowClick = (evt: Event, row: any) => {
   // Lógica de selección única por ahora, alternar
   const selected = [...props.selected];
   const index = selected.findIndex((r: any) => r[props.rowKey] === row[props.rowKey]);

   if (index > -1) {
      selected.splice(index, 1);
   } else {
      // Para selección única, limpiar otros. Para múltiple, solo agregar.
      // Asumiendo selección única según implicación "la selección"
      // Pero hagamos que se comporte como selección única (reemplazar)
      selected.length = 0;
      selected.push(row);
   }

   emit('update:selected', selected);
   emit('row-click', row);
};

const onActionMenuClick = (row: any) => {
   const isSelected = props.selected.some((r: any) => r[props.rowKey] === row[props.rowKey]);
   if (!isSelected) {
      emit('update:selected', [row]);
   }
};

const exportTable = () => {
   // codificación a formato csv
   const content = [visibleColumns.value.map((col: any) => wrapCsvValue(col.label))]
      .concat(
         tableRef.value.computedRows.map((row: any) =>
            visibleColumns.value
               .map((col: any) =>
                  wrapCsvValue(
                     typeof col.field === 'function'
                        ? col.field(row)
                        : row[col.field === void 0 ? col.name : col.field],
                     col.format,
                     row,
                  ),
               )
               .join(','),
         ),
      )
      .join('\r\n');

   const status = exportFile('table-export.csv', content, 'text/csv');

   if (status !== true) {
      console.error('El navegador denegó la descarga del archivo...', status);
   }
};

const wrapCsvValue = (val: any, formatFn?: (val: any, row?: any) => any, row?: any) => {
   let formatted = formatFn !== void 0 ? formatFn(val, row) : val;

   formatted = formatted === void 0 || formatted === null ? '' : String(formatted);

   formatted = formatted.split('"').join('""');
   /**
    * Excel acepta \n como nueva línea en una celda, así que reemplazamos \n con \n
    * pero también necesitamos envolver la celda en comillas
    */
   return `"${formatted}"`;
};

// Exponemos los métodos para que puedan ser accedidas desde el componente padre
defineExpose({
   exportTable,
});
</script>

<style lang="scss" scoped>
.my-sticky-header-table {
   /* la altura o altura máxima es importante */
   height: 100%;

   :deep(.q-table__top),
   :deep(.q-table__bottom) {
      /* el color de fondo es importante para th; solo especifica uno */
      background-color: #fff;
   }

   :deep(thead tr:first-child th) {
      background-color: var(--q-primary);
      color: white;
      font-family: monospace;
      font-weight: bold;
      font-size: 1.1em;
   }

   :deep(thead tr th) {
      position: sticky;
      z-index: 1;
   }

   :deep(thead tr:first-child th) {
      top: 0;
   }

   /* esto es cuando aparece el indicador de carga */
   :deep(.q-table--loading thead tr:last-child th) {
      /* altura de todas las filas de encabezado anteriores */
      top: 48px;
   }
}

.monospace-data {
   font-family: monospace;
   font-size: 0.9em; /* Opcional: monospace a menudo se ve más grande */
}
</style>
