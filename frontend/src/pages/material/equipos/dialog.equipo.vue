<template>
   <q-dialog
      :model-value="show"
      @update:model-value="$emit('update:show', $event)"
   >
      <q-card style="min-width: 400px">
         <q-card-section>
            <div class="text-h6">{{ sede ? 'Editar Sede' : 'Nueva Sede' }}</div>
         </q-card-section>

         <q-card-section>
            <q-form
               @submit="onSubmit"
               class="q-gutter-md"
            >
               <q-input
                  v-model="nombre"
                  label="Nombre"
                  outlined
                  dense
                  :rules="[(val) => !!val || 'El nombre es requerido']"
               />

               <SelectMunicipio
                  v-model:municipio="municipio"
                  :rules="[(val: any) => !!val || 'El municipio es requerido']"
               />

               <div class="row justify-end q-gutter-sm q-mt-md">
                  <q-btn
                     label="Cancelar"
                     color="negative"
                     flat
                     v-close-popup
                  />
                  <q-btn
                     label="Guardar"
                     type="submit"
                     color="primary"
                  />
               </div>
            </q-form>
         </q-card-section>
      </q-card>
   </q-dialog>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import SelectMunicipio from 'components/SelectMunicipio.vue';

const props = defineProps<{
   show: boolean;
   sede?: any;
}>();

const emit = defineEmits(['update:show', 'save']);

const nombre = ref('');
const municipio = ref<any>(null);

const onSubmit = () => {
   if (!nombre.value || !municipio.value) {
      return;
   }

   emit('save', {
      id: props.sede?.id,
      nombre: nombre.value,
      municipio: municipio.value.id,
   });

   nombre.value = '';
   municipio.value = null;

   emit('update:show', false);
};

watch(
   () => props.show,
   (val) => {
      if (val && props.sede) {
         nombre.value = props.sede.nombre;
         municipio.value = props.sede.municipio;
      } else if (val && !props.sede) {
         nombre.value = '';
         municipio.value = null;
      }
   },
);
</script>
