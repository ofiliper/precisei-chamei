
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


    async readAll() {
        const request = await fnFetch({
            url: `${this.defaultUrl}/services`,
            method: 'GET',
            // body: data,
     
        })
        return request;
    };



}
