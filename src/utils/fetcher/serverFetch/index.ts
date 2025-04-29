
import { userCookies } from "@/utils/cookies";
import { is_formdata } from "@/utils/helpers_function";
import { Helps } from "@/utils/helps";


const serverFetch = (server_access_token?: string) => {
    return {
        get: request('GET', server_access_token),
        post: request('POST', server_access_token),
        put: request('PUT', server_access_token),
        delete: request('DELETE', server_access_token)
    };

    function request(method: string, server_access_token?: string) {
        return async (url: string, body?: any, priority?: "auto" | "high" | "low"): Promise<ResponseUseFetch> => {

            const headers = new Headers();

            // const access_token = (server_access_token && server_access_token != '') ? server_access_token : userCookies?.access_token;
            const access_token = "eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyLDYyMTAxMDEwMSIsInJvbGVzIjpbIkdFU1RJT05OQUlSRSJdLCJpc3MiOiJMQVRSVVNULUFQSSIsImlhdCI6MTc0NTc0NjEyNCwiZXhwIjoxNzQ1NzQ3OTI0fQ.qzKy2_lw4YBUfAVf7eaf-2Y4aqNtBg8XR1JWKDzwUIY"
            if (access_token) {
                headers.append("Authorization", `Bearer ${access_token}`)
            }

            headers.append("Content-Type", is_formdata(body) ? "multipart/form-data" : "application/json");

            const requestOptions: RequestInit = {
                method,
                mode: "cors",
                cache: "no-store",
                headers,
            };

            if (body) {
                requestOptions.body = is_formdata(body) ? body : JSON.stringify(body);
            }
            if (priority) {
                requestOptions.priority = priority;
            }

            try {
                return await fetch(url, requestOptions).then(handleResponse);
            } catch (e) {
                if (e instanceof Error) {
                    console.error('Fetch error:', e.message);
                } else {
                    console.error('Unexpected error:', e);
                }
                throw e;
            }
        }
    }

    async function handleResponse(response: Response): Promise<ResponseUseFetch> {
        const contentType = response.headers.get('Content-Type');
        let data;

        if (contentType && contentType.includes('application/json')) {
            data = await response.json();
        } else {
            data = await response.text();
        }

        // if (!response.ok) {
        //     const error = {
        //         status: response.status,
        //         statusText: response.statusText,
        //         data,
        //     };
        //     console.error('Response error:', error);
        //     throw error;
        // }

        if (data.status === 200 && data.message.includes('SUCCESS')) {
            data.success = true
        } else {
            data.success = false
            data.message = data.message ?? data?.errror
        }

        return data
    }
}

export default serverFetch