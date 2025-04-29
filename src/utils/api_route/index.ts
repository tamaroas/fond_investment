
import { Helps } from "../helps";



const url_api = Helps.api_url
export function api_route() {

    return {
        auth: {
            login: `${url_api}/auth/login`,
            register: `${url_api}/auth/register`,
            logout: `${url_api}/auth/logout`,
        },
        user: {
            add: `${url_api}/v1/client`,
            getSingle: `${url_api}/v1/client/{id}`,
            getAll: `${url_api}/v1/client`,
            getByNumber: `${url_api}/v1/client/telephone/{numero}`,
            getByManage: `${url_api}/v1/client/gestionnaire/{id}`,
            edit: `${url_api}/v1/client/{id}`,
            disabled: `${url_api}/v1/client/{id}/suspend`,
            enabled: `${url_api}/v1/client/{id}/activer`,
        }
    }

}