import { ref, onMounted, computed, reactive } from 'vue';
import { QTableProps } from 'quasar';
import { Action } from 'components/VistaTabla/types';
import { ApiTipos } from './api.tipos';
import { useSolicitar } from 'src/composables/useSolicitar';

// composable para manejo de la lógica de la página de tipos
export function useTipos() {
   const { pedirConfirmacion } = useSolicitar();

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
   const tipo = ref<any>(null);

   // Métodos
   const consultarTipos = async () => {
      try {
         loading.value = true;
         // obtenemos todas las sedes
         const listaTipos = await ApiTipos.consultarTipos();
         rows.value = listaTipos;
      } catch (error) {
         console.error('Error al cargar tipos:', error);
      } finally {
         loading.value = false;
      }
   };

   const onRequest = () => {
      consultarTipos();
   };

   const onEliminarTipo = async (tipo: any) => {
      if (await pedirConfirmacion('¿Está seguro de que desea eliminar este tipo?')) {
         try {
            loading.value = true;
            await ApiTipos.eliminarTipo(tipo.id);
            await consultarTipos();
         } catch (error) {
            console.error('Error al eliminar tipo:', error);
         } finally {
            loading.value = false;
         }
      }
   };

   const onGuardarTipo = async (tipoData: any) => {
      const { id, ...tipo } = tipoData;
      try {
         loading.value = true;
         if (id) {
            await ApiTipos.actualizarTipo(id, tipo);
         } else {
            await ApiTipos.crearTipo(tipo);
         }
         await consultarTipos();
      } catch (error) {
         console.error('Error al guardar tipo:', error);
      } finally {
         loading.value = false;
      }
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
            tipo.value = null;
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
         handler: (row: any) => {
            tipo.value = { ...row };
            showDialog.value = true;
         },
      },
      // eliminar tipo
      {
         name: 'eliminar',
         icon: 'delete',
         label: 'Eliminar',
         handler: onEliminarTipo,
      },
   ]);

   // Lifecycle (ciclo de vida)
   onMounted(() => {
      consultarTipos();
   });

   // Return (retorno)
   const modelo = reactive({
      rows,
      loading,
      pagination,
      selected,
      showDialog,
      tipo,
      actions,
      rowActions,
   });

   const control = {
      columns,
      onRequest,
      onGuardarTipo,
   };

   return {
      modelo,
      control,
   };
}
