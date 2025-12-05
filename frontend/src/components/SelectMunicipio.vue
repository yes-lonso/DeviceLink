<template>
  <div class="row q-col-gutter-sm">
    <div class="col-12 col-md-6">
      <q-select
        v-model="provinciaSel"
        :options="provincias"
        label="Provincia"
        option-label="nombre"
        option-value="id"
        outlined
        dense
        emit-value
        map-options
        @update:model-value="onCambioProvincia"
        :loading="procesandoProvincias"
      />
    </div>
    <div class="col-12 col-md-6">
      <q-select
        v-model="municipioSel"
        :options="municipios"
        label="Municipio"
        option-label="nombre"
        option-value="id"
        outlined
        dense
        :disable="!provinciaSel"
        :loading="procesandoMunicipios"
        :rules="rules"
        @update:model-value="onCambioMunicipio"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { ApiMunicipios } from 'src/pages/infra/municipios/api.municipios';

const props = defineProps<{
  municipio?: any;
  rules?: any[];
}>();

const emit = defineEmits(['update:municipio']);

const provincias = ref<any[]>([]);
const municipios = ref<any[]>([]);
const provinciaSel = ref<string | null>(null);
const municipioSel = ref<any>(null);
const procesandoProvincias = ref(false);
const procesandoMunicipios = ref(false);

const consultarProvincias = async () => {
  try {
    procesandoProvincias.value = true;
    provincias.value = await ApiMunicipios.consultarProvincias();
  } catch (error) {
    console.error('Error loading provincias:', error);
  } finally {
    procesandoProvincias.value = false;
  }
};

const onCambioProvincia = async (id: string) => {
  municipioSel.value = null;
  municipios.value = [];
  
  if (id) {
    try {
      procesandoMunicipios.value = true;
      municipios.value = await ApiMunicipios.consultarMunicipios(id);
    } catch (error) {
      console.error('Error loading municipios:', error);
    } finally {
      procesandoMunicipios.value = false;
    }
  }
};

const onCambioMunicipio = (val: any) => {
  emit('update:municipio', val);
};

// Watch para reaccionar a cambios externos del componente padre
watch(() => props.municipio, async (newVal) => {
  if (newVal) {
    // provincia y municipio
    const {provincia, ...municipio} = newVal;
    provinciaSel.value = provincia;
    await onCambioProvincia(provincia.id);
    municipioSel.value = municipio;
  } else {
    // Reset
    provinciaSel.value = null;
    municipios.value = [];
    municipioSel.value = null;
  }
}, { immediate: true });

onMounted(() => {
  consultarProvincias();
});
</script>
