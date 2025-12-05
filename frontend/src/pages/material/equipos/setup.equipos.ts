import { ref, onMounted, computed, reactive } from 'vue';
import { QTableProps } from 'quasar';
import { Action } from 'components/VistaTabla/types';
import { ApiEquipos } from './api.equipos';

// composable para manejo de la lógica de la página de sedes
export function useEquipos() {

   // Orden de las secciones siguiendo la buenas prácticas de composable
   // Constantes
   // Estado
   // Métodos
   // Computed properties (propiedadades computadas)
   // Lifecycle (ciclo de vida)
   // Return (retorno)

   // Constantes
   const columns: QTableProps['columns'] = [
      { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
      { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
      {
         name: 'municipio',
         align: 'left',
         label: 'Municipio',
         field: (row: any) => row.municipio?.nombre || '',
         sortable: true,
      },
      {
         name: 'provincia',
         align: 'left',
         label: 'Provincia',
         field: (row: any) => row.municipio?.provincia?.nombre || '',
         sortable: true,
      },
      { name: 'actions', align: 'right', label: 'Acciones', field: 'actions', sortable: false },
   ];

   // Estado
   const loading = ref<boolean>(false);
   const rows = ref<any[]>([]);
   const pagination = ref({
      sortBy: 'nombre',
      descending: false,
      page: 1,
      rowsPerPage: 0,
   });
   const selected = ref<any[]>([]);
   const showDialog = ref(false);
   const equipo = ref<any>(null);

   // Métodos
   const consultarSedes = async () => {
      try {
         loading.value = true;
         // obtenemos todas las sedes
         const listaSedes = await ApiEquipos.consultarEquipos();
         rows.value = listaSedes;
      } catch (error) {
         console.error('Error al cargar sedes:', error);
      } finally {
         loading.value = false;
      }
   };

   const onRequest = () => {
      consultarSedes();
   };

   // Computed properties (propiedades computadas)
   const actions = computed<Action[]>(() => [
      // nueva sede
      {
         name: 'nueva',
         icon: 'add',
         label: 'Nueva Sede',
         color: 'primary',
         flat: false,
         outline: true,
         type: 'button',
         handler: () => {
            equipo.value = null;
            showDialog.value = true;
         },
      },
   ]);

   const rowActions = computed<Action[]>(() => [
      // editar sede
      {
         name: 'editar',
         icon: 'edit',
         label: 'Editar',

         handler: (row: any) => {},
      },
      // eliminar sede
      {
         name: 'eliminar',
         icon: 'delete',
         label: 'Eliminar',
         handler: (row: any) => {},   
      },
   ]);

   // Lifecycle (ciclo de vida)
   onMounted(() => {
      consultarSedes();
   });

   // Return (retorno)
   const modelo = reactive({
      rows,
      loading,
      pagination,
      selected,
      showDialog,
      equipo,
      actions,
      rowActions,
   });

   const control = {
      columns,
      onRequest,
      onGuardarEquipo: () => {},
   };

   return {
      modelo,
      control,
   };
}
