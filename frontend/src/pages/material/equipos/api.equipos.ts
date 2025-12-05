import { api } from 'boot/axios';

export class ApiEquipos {

    static async consultarEquipos(): Promise<any[]> {
        const {data} = await api.get('/equipos');
        return data;
    }
}
