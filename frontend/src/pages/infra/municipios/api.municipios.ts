import { api } from 'boot/axios';

export class ApiMunicipios {

    static async actualizarMunicipiosDesdeArchivo(file: File): Promise<void> {
        const formData = new FormData();
        formData.append('file', file);

        await api.post('/municipios/subir', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
    }

    static async consultarProvincias(): Promise<any[]> {
        const { data } = await api.get('/municipios/provincias');
        return data;
    }

    static async buscarMunicipios(valor: string): Promise<any[]> {
        const { data } = await api.get(`/municipios/buscar?valor=${valor}`);
        return data;
    }

    static async consultarMunicipios(id: string): Promise<any[]> {
        const { data } = await api.get(`/municipios/${id}`);
        return data;
    }
}
