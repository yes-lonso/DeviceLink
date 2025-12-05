<template>
   <q-dialog
      :model-value="show"
      @update:model-value="$emit('update:show', $event)"
   >
      <q-card style="min-width: 400px">
         <q-card-section>
            <div class="text-h6">{{ tipo ? 'Editar Tipo' : 'Nuevo Tipo' }}</div>
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

const props = defineProps<{
   show: boolean;
   tipo?: any;
}>();

const emit = defineEmits(['update:show', 'save']);

const nombre = ref('');
const municipio = ref<any>(null);

const onSubmit = () => {
   if (!nombre.value) {
      return;
   }

   emit('save', {
      id: props.tipo?.id,
      nombre: nombre.value,
   });

   nombre.value = '';
   municipio.value = null;

   emit('update:show', false);
};

watch(
   () => props.show,
   (val) => {
      if (val && props.tipo) {
         nombre.value = props.tipo.nombre;
      } else if (val && !props.tipo) {
         nombre.value = '';
      }
   },
);
</script>
