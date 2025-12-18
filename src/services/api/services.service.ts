
import { fnFetch } from "@/utils/functions/fnFetch";
import { AnswerDTO } from "../dto";
import { HttpService } from "./http.service";
import { AuthResponse } from "@/@types/auth";

export class ServicesService extends HttpService {

    constructor() {
        super('services')
    }

    async readOne(id_service: string) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/${id_service}`,
            method: 'GET',
            // body: data,
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            }
        })
        return request;
    };


    async readAll() {
        const request = await fnFetch({
            url: `${this.defaultUrl}/`,
            method: 'GET',
            // body: data,
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            }
        })
        return request;
    };

    async create(data: { image: any }) {
        // return this.post<AnswerDTO>("/auth/signup", data);
        const request = await fnFetch({
            url: `${this.defaultUrl}`,
            method: 'POST',
            body: data,
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            }
        })
        return request;
    };

    async remove(id_service: string) {
        const request = await fnFetch<AuthResponse>({
            url: `${this.defaultUrl}/${id_service}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            }
        })

        return request
    };


}
