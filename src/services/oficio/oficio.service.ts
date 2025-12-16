
import { fnFetch } from "@/utils/functions/fnFetch";
import { HttpService } from "../api/http.service";
import { EditIndicacaoDTO, IndicacaoDTO } from "../indicacoes/indicacao.dto";


export class OficioService extends HttpService {

    constructor() {
        super('oficios');
    }

    async createOficio(data: IndicacaoDTO) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/aprovar/`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                // 'vereador': `${this.cookies.get('vereador')}`,
                'vereador': '0ca2d92c-8949-4fb5-8fb3-045417ec1cf8',
            },
        })

        return request;
    };

    async editOficio(data: EditIndicacaoDTO) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/aprovar/${data.id}`,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                // 'vereador': `${this.cookies.get('vereador')}`,
                'vereador': '0ca2d92c-8949-4fb5-8fb3-045417ec1cf8',
            },
        })

        return request;
    };

    async approveOficio(data: { id: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/aprovar/${data.id}`,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                // 'vereador': `${this.cookies.get('vereador')}`,
                'vereador': '0ca2d92c-8949-4fb5-8fb3-045417ec1cf8',
            },
        })

        return request;
    };

    async readAllLiderOficios(data: { id: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/lider`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                // 'vereador': `${this.cookies.get('vereador')}`,
                'vereador': '0ca2d92c-8949-4fb5-8fb3-045417ec1cf8',
            },
        })

        return request;
    };

    async readAllOficios(data: { id: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                // 'vereador': `${this.cookies.get('vereador')}`,
                'vereador': '0ca2d92c-8949-4fb5-8fb3-045417ec1cf8',
            },
        })

        return request;
    };

}