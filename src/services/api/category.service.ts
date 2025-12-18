
import { fnFetch } from "@/utils/functions/fnFetch";
import { AnswerDTO } from "../dto";
import { HttpService } from "./http.service";
import { AuthResponse } from "@/@types/auth";

export class CategoryServices extends HttpService {

    constructor() {
        super('categories')
    }

    async readAll() {
        const request = await fnFetch({
            url: `${this.defaultUrl}/`,
            method: 'GET',
            // body: data,
            // headers: {
            //     Authorization: `Bearer ${this.cookies.get('userid')}`,
            //     Workspace: `${this.cookies.get('workspace')}`
            // }
        })
        return request;
    };

     


}
