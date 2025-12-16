
import { fnFetch } from "@/utils/functions/fnFetch";
import { AnswerDTO, UserDTO } from "../dto";
import { HttpService } from "./http.service";
import { AuthResponse } from "@/@types/auth";

export class AuthService extends HttpService {

    constructor() {
        super('auth')
    }

    async register(data: UserDTO) {
        // return this.post<AnswerDTO>("/auth/signup", data);
        const request = await fnFetch({
            url: `${this.defaultUrl}/signup`,
            method: 'POST',
            body: data,
        })
    };

    async login(data: { email: string, password: string }) {
        const request = await fnFetch<AuthResponse>({
            url: `${this.defaultUrl}/login`,
            method: 'POST',
            body: data,
        })

        return request
    };

}
