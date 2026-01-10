
import { fnFetch } from "@/utils/functions/fnFetch";
import { AnswerDTO } from "../dto";
import { HttpService } from "./http.service";
import { AuthResponse } from "@/@types/auth";

export class WorkspaceService extends HttpService {

    constructor() {
        super('workspaces')
    }
    async read() {
        const request = await fnFetch ({
            url: `${this.defaultUrl}/${this.cookies.get('workspace')}`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                // Workspace: `${this.cookies.get('workspace')}`
            }
        })

        return request
    };

    async readAll() {
        const request = await fnFetch ({
            url: `${this.defaultUrl}/`,
            method: 'GET',
            headers: {
                Authorization: `Bearer ${this.cookies.get('userid')}`,
                // Workspace: `${this.cookies.get('workspace')}`
            }
        })

        return request
    };

}
