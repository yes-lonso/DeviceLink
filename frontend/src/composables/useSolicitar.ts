import { useQuasar } from 'quasar';

export function useSolicitar() {
   const $q = useQuasar();

   const pedirConfirmacion = (
      mensaje: string,
      titulo: string = 'Confirmación',
   ): Promise<boolean> => {
      return new Promise((resolve) => {
         $q.dialog({
            title: titulo,
            message: mensaje,
            cancel: {
               label: 'Cancelar',
               color: 'negative',
               flat: true,
            },
            ok: {
               label: 'Aceptar',
               color: 'primary',
            },
            persistent: true,
         })
            .onOk(() => resolve(true))
            .onCancel(() => resolve(false));
      });
   };

   return {
      pedirConfirmacion,
   };
}
