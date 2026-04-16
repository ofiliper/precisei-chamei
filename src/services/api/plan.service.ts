
import { fnFetch } from "@/utils/functions/fnFetch";
import { AnswerDTO } from "../dto";
import { HttpService } from "./http.service";
import { AuthResponse } from "@/@types/auth";

export class PlansService extends HttpService {

    constructor() {
        super('plans')
    }

    async readAll() {
        const request = await fnFetch({
            url: `${this.defaultUrl}/`,
            method: 'GET',
 
        })
        return request;
    };



}
