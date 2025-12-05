import { ref, onMounted, computed } from 'vue';
import { QTableProps } from 'quasar';
import { Action } from 'components/VistaTabla/types';
import { ApiMunicipios } from './api.municipios';


// composable para manejo de la lógica de la página de municipios
export function useMunicipios() {
    const loading = ref<boolean>(false);
    const rows = ref<any[]>([]);
    const pagination = ref({
        sortBy: 'nombre',
        descending: false,
        page: 1,
        rowsPerPage: 0,
    });

    const provincias = ref<any[]>([]);
    const provinciaSeleccionada = ref(null);
    const nombreBusqueda = ref<string>('');
    const codigoBusqueda = ref<string>('');
    const selected = ref<any[]>([]);

    const hayProvincias = computed(() => provincias.value.length > 0);

    const columns: QTableProps['columns'] = [
        { name: 'id', align: 'left', label: 'ID', field: 'id', sortable: true },
        { name: 'codigo', align: 'left', label: 'Código', field: 'codigo', sortable: true },
        { name: 'nombre', align: 'left', label: 'Nombre', field: 'nombre', sortable: true },
        { name: 'provincia', align: 'left', label: 'Provincia', field: "provincia", sortable: true },
    ];

    const onSubirMunicipios = () => {
        rows.value = [];
        selected.value = [];
        nombreBusqueda.value = '';
        codigoBusqueda.value = '';
        provinciaSeleccionada.value = null;
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = '.xlsx, .xls';
        input.onchange = async (e: any) => {
            const file = e.target.files[0];
            if (!file) return;

            const formData = new FormData();
            formData.append('file', file);

            try {
                loading.value = true;
                await ApiMunicipios.actualizarMunicipiosDesdeArchivo(file);
                console.log('Archivo subido correctamente');

                await getProvincias();
            } catch (error) {
                console.error('Error al subir el archivo:', error);
            } finally {
                loading.value = false;
            }
        };
        input.click();
    };

    const onBuscarMunicipios = async (val: string) => {
        console.log('Buscar por nombre/código:', val);
        if (!val) return;

        loading.value = true;
        try {
            // Borrar la provincia seleccionada al buscar globalmente
            provinciaSeleccionada.value = null;
            const resultados = await ApiMunicipios.buscarMunicipios(val);
            rows.value = resultados;
        } catch (error) {
            console.error('Error al buscar municipios:', error);
            rows.value = [];
        } finally {
            loading.value = false;
        }
    };

    const actions = computed<Action[]>(() => [
        {
            type: 'input',
            disabled: !hayProvincias.value,
            placeholder: 'Buscar por nombre...',
            value: nombreBusqueda.value,

            handler: (val: string) => {
                onBuscarMunicipios(val);
            },
            inputConfig: {
                style: 'width: 200px',
            },
            minLength: 2,
        },
        {
            type: 'input',
            disabled: !hayProvincias.value,
            placeholder: 'Código',
            value: codigoBusqueda.value,
            handler: (val: string) => {
                console.log('Buscar por código:', val);
                onBuscarMunicipios(val);
            },
            inputConfig: {
                style: 'width: 150px',
            },
            minLength: 2,
        },
        {
            type: 'select',
            placeholder: 'Provincia',
            value: provinciaSeleccionada.value,
            disabled: !hayProvincias.value,
            options: provincias.value,
            handler: async (val: any) => {
                console.log('Filtrar por provincia:', val);
                provinciaSeleccionada.value = val;
                if (val) {
                    loading.value = true;
                    try {
                        const municipios = await ApiMunicipios.consultarMunicipios(val.value);
                        rows.value = municipios;
                    } catch (error) {
                        console.error('Error al cargar municipios:', error);
                        rows.value = [];
                    } finally {
                        loading.value = false;
                    }
                } else {
                    rows.value = [];
                }
            },
        },
        {
            label: 'Cargar Municipios',
            icon: 'cloud_upload',
            color: 'primary',
            flat: false,
            outline: true,
            handler: onSubirMunicipios,
        },

    ]);

    const onRowClick = (evt: Event, row: any) => {
        console.log('Row clicked:', row);
    };

    const onRequest = () => {
        rows.value = [];
        nombreBusqueda.value = '';
        codigoBusqueda.value = '';
        provinciaSeleccionada.value = null;
    };

    const getProvincias = async () => {
        try {
            const listaProvincias = await ApiMunicipios.consultarProvincias();
            provincias.value = listaProvincias.map(p => ({ label: p.nombre, value: p.id }));
        } catch (error) {
            console.error('Error al cargar provincias:', error);
        }
    };

    onMounted(() => {
        getProvincias();
    });

    return {
        rows,
        columns,
        actions,
        loading,
        pagination,
        selected,
        onRequest,
        onRowClick,
    };
}

