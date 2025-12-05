import { useQuasar } from 'quasar';

export function useNotificar() {
   const $q = useQuasar();

   const notificarExito = (message: string) => {
      $q.notify({
         message,
         color: 'positive',
         icon: 'check_circle',
         position: 'top-right',
         timeout: 3000,
      });
   };

   const notificarError = (message: string) => {
      $q.notify({
         message,
         color: 'negative',
         icon: 'error',
         position: 'center',
         timeout: 3000,
      });
   };

   const notificarAdvertencia = (message: string) => {
      $q.notify({
         message,
         color: 'warning',
         textColor: 'black',
         icon: 'warning',
         position: 'center',
         timeout: 2000,
      });
   };

   const notificarInfo = (message: string) => {
      $q.notify({
         message,
         color: 'info',
         icon: 'info',
         position: 'top-right',
         timeout: 3000,
      });
   };

   return {
      notificarExito,
      notificarError,
      notificarAdvertencia,
      notificarInfo,
   };
}
