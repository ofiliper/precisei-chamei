
import { fnFetch } from "@/utils/functions/fnFetch";
import { AnswerDTO } from "../dto";
import { HttpService } from "./http.service";
import { AuthResponse } from "@/@types/auth";

export class AuthService extends HttpService {

    constructor() {
        super('auth')
    }

    async register(data: { name: string, email: string, phone: string, password: string }) {
        // return this.post<AnswerDTO>("/auth/signup", data);
        const request = await fnFetch({
            url: `${this.defaultUrl}/signup`,
            method: 'POST',
            body: data,
        })
    };

    async confirm(data: { email: string, token: string }) {
        // return this.post<AnswerDTO>("/auth/signup", data);
        const request = await fnFetch({
            url: `${this.defaultUrl}/confirm`,
            method: 'POST',
            body: data,
        })
        return request;
    };

    async login(data: { email: string, password: string }) {
        const request = await fnFetch<AuthResponse>({
            url: `${this.defaultUrl}/login`,
            method: 'POST',
            body: data,
        })

        return request
    };

    async forgot(data: { email: string }) {
        const request = await fnFetch<AuthResponse>({
            url: `${this.defaultUrl}/forgot`,
            method: 'POST',
            body: data,
        })

        return request
    };

    async updatePassword(data: { email: string, password: string, token: string }) {
        const request = await fnFetch<AuthResponse>({
            url: `${this.defaultUrl}/save-password`,
            method: 'POST',
            body: data,
        })

        return request
    };

}
