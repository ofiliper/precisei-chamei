
import { fnFetch } from "@/utils/functions/fnFetch";
import { AnswerDTO } from "../dto";
import { HttpService } from "./http.service";
import { AuthResponse } from "@/@types/auth";

export class UsersService extends HttpService {

    constructor() {
        super('users')
    }

    async update(data: { name?: string, password?: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}`,
            method: 'PUT',
            body: data,
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            }
        })
        return request
    };


    async read() {
        const request = await fnFetch ({
            url: `${this.defaultUrl}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            }
        })

        return request
    };

}
