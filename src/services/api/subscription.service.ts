
import { fnFetch } from "@/utils/functions/fnFetch";
import { AnswerDTO } from "../dto";
import { HttpService } from "./http.service";
import { AuthResponse } from "@/@types/auth";

export class SubscriptionService extends HttpService {

    constructor() {
        super('subscriptions')
    }
    // '/generate-stripe-link',
    // '/generate-pix',
    // '/consult-pix',
    async createStripeLink(plan: string) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/create-stripe-link`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            },
            body: {
                plan
            }
        })
        return request;
    };
    async generatePix(plan: string) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/generate-pix`,
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            },
            body: {
                plan
            }

        })
        return request;
    };
    async consultPix(id_payment: string) {
        const request = await fnFetch({
            url: `${this.defaultUrl}/consult-pix/${id_payment}`,
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                Workspace: `${this.cookies.get('workspace')}`
            }

        })
        return request;
    };



}
