import { APP_CONFIG } from "@/constants/app-config";
import { Cookies } from "react-cookie";

export class HttpService {
    protected defaultUrl;
    protected baseUrl;
    public cookies = new Cookies()

    constructor(context: string) {
        const route =
            process.env.NODE_ENV === 'development'
                ? APP_CONFIG.api.development
                : APP_CONFIG.api.production

        this.baseUrl = route
        this.defaultUrl = route + '/' + context
    }

}
