
import { fnFetch } from "@/utils/functions/fnFetch";
import { AnswerDTO } from "../dto";
import { HttpService } from "./http.service";
import { AuthResponse } from "@/@types/auth";

export class ImagesService extends HttpService {

    constructor() {
        super('images')
    }

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
            url: `${this.defaultUrl}/`,
            method: 'POST',
            contentType: 'multipart/form-data',
            body: data,
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            }
        })
        return request;
    };

    async remove(id_image: string) {
        const request = await fnFetch<AuthResponse>({
            url: `${this.defaultUrl}/${id_image}`,
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            }
        })

        return request
    };


}
