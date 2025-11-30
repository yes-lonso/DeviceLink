import { api } from 'boot/axios';

export class MunicipiosService {

    static async uploadMunicipios(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);

        await api.post('/municipios/subir', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    static async getProvincias(): Promise<any[]> {
        const response = await api.get('/municipios/provincias');
        return response.data;
    }

    static async getMunicipios(codigoProvincia: string): Promise<any[]> {
        const response = await api.get(`/municipios/provincias/${codigoProvincia}`);
        // el backend devuelve la provincia y extraemos el array de municipios
        console.log(response.data); 
        return response.data.municipios || [];
    }

    static async buscarMunicipios(valor: string): Promise<any[]> {
        const response = await api.get(`/municipios/buscar?valor=${valor}`);
        return response.data;
    }
}
