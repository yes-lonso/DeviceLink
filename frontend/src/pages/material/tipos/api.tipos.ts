import { api } from 'boot/axios';

export class ApiTipos {

    static async consultarTipos(): Promise<any[]> {
        const {data} = await api.get('/tipos');
        return data;
    }

    static async crearTipo(tipo: any): Promise<any> {
        const {data} = await api.post('/tipos', tipo);
        return data;
    }

    static async actualizarTipo(id: string, tipo: any): Promise<any> {
        const {data} = await api.put(`/tipos/${id}`, tipo);
        return data;
    }

    static async eliminarTipo(id: string): Promise<any> {
        const {data} = await api.delete(`/tipos/${id}`);
        return data;
    }
}
