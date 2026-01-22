
import { fnFetch } from "@/utils/functions/fnFetch";
import { AnswerDTO } from "../dto";
import { HttpService } from "./http.service";
import { AuthResponse } from "@/@types/auth";

export class PublicServiceService extends HttpService {

    constructor() {
        super('page')
    }

    async readOne(id_service: string) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/services/${id_service}`,
            method: 'GET',
            // body: data,

        })
        return request;
    };

    async readAll(queryParams?: {
        lat?: string;
        lng?: string;
        id_category?: string;
        id_subcategory?: string;
        page_size?: number
        current_page?: number
    }) {
        // 1. Instancia o construtor de parâmetros
        const params = new URLSearchParams();

        // 2. Adiciona os parâmetros apenas se eles existirem (para evitar "undefined" na URL)
        if (queryParams?.lat) params.append('lat', queryParams.lat);
        if (queryParams?.lng) params.append('lng', queryParams.lng);
        if (queryParams?.id_category) params.append('categoria', queryParams.id_category);
        if (queryParams?.id_subcategory) params.append('subcategoria', queryParams.id_subcategory);
        if (queryParams?.page_size) params.append('page_size', queryParams.page_size.toString());
        if (queryParams?.current_page) params.append('current_page', queryParams.current_page.toString());

        // 3. Converte para string (ex: "lat=-23.5&lng=-46.6")
        const queryString = params.toString();

        // 4. Monta a URL final
        // Se queryString não for vazia, adiciona o "?" antes.
        const finalUrl = queryString
            ? `${this.defaultUrl}/services?${queryString}`
            : `${this.defaultUrl}/services`;

        const request = await fnFetch({
            url: finalUrl,
            method: 'GET',
        });

        return request;
    }

    async createWhatsappContact(id_service: string) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/services/whatsapp`,
            method: 'POST',
            body: {
                id_service
            }
            // body: data,

        })
        return request;
    };

}
