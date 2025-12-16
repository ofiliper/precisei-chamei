
import { fnFetch } from "@/utils/functions/fnFetch";
import { HttpService } from "../api/http.service";
import { EditIndicacaoDTO, IndicacaoDTO } from "./indicacao.dto";


export class IndicacoesService extends HttpService {

    constructor() {
        super('indicacoes');
    }

    async createIndicacao(data: IndicacaoDTO) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                // 'vereador': `${this.cookies.get('vereador')}`,
                'vereador': '0ca2d92c-8949-4fb5-8fb3-045417ec1cf8',
            },
            body: data,
        })

        return request;
    };

    async editIndicacao(data: EditIndicacaoDTO) {
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

    async approveIndicacao(data: { id: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/aprovar/${data.id}`,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                'vereador': `${this.cookies.get('vereador')}`,
            },
        })

        return request;
    };

    async readAllLiderIndicacoes(data?: { page?: number, limit?: number, search?: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/lider?page=${data?.page || 1}&limit=${data?.limit || 30}&search=${data?.search || ''}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                'vereador': `${this.cookies.get('vereador')}`,
            },
        })

        return request;
    };

    async readAllIndicacoes(data?: { page?: number, limit?: number, search?: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}?page=${data?.page || 1}&limit=${data?.limit || 30}&search=${data?.search || ''}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                'vereador': `${this.cookies.get('vereador')}`,
            },
        })

        return request;
    };

}