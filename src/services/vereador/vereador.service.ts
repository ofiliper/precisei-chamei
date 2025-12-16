
import { fnFetch } from "@/utils/functions/fnFetch";
import { HttpService } from "../api/http.service";


export class VereadorService extends HttpService {

    constructor() {
        super('vereador')
    }

    async editVereador(data: { id: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}`,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                'vereador': `${this.cookies.get('vereador')}`,
            },
        })

        return request
    };

    async editUserRelationship(data: { id: string, role?: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/user/${data.id}`,
            method: 'PUT',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                'vereador': `${this.cookies.get('vereador')}`,
            },
            body: { role: data.role }
        })

        return request
    };

    async addUserToVereador(data: { id: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/add-user`,
            method: 'POST',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                'vereador': `${this.cookies.get('vereador')}`,
            },
        })

        return request
    };

    async readAllUserFromVereador() {
        const request = await fnFetch({
            url: `${this.defaultUrl}/users`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                'vereador': `${this.cookies.get('vereador')}`,
            },
        })

        return request
    };

    async readAllVereadoresFromUser() {
        const request = await fnFetch({
            url: `${this.defaultUrl}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                'vereador': `${this.cookies.get('vereador')}`,
            },
        })

        return request
    };

    async readVereadorInfo(data: { id: string }) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/${data.id}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                'vereador': `${this.cookies.get('vereador')}`,
            },
        })

        return request
    };

}