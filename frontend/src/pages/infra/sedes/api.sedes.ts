import { api } from 'boot/axios';

export class ApiSedes {

    static async consultarSedes(): Promise<any[]> {
        const {data} = await api.get('/sedes');
        return data;
    }

    static async crearSede(sede: any): Promise<any> {
        const {data} = await api.post('/sedes', sede);
        return data;
    }

    static async actualizarSede(id: string, sede: any): Promise<any> {
        const {data} = await api.put(`/sedes/${id}`, sede);
        return data;
    }

    static async eliminarSede(id: string): Promise<any> {
        const {data} = await api.delete(`/sedes/${id}`);
        return data;
    }
}
