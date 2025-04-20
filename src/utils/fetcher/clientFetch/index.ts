import { IS_SERVER } from "@/utils/helpers_function";
import { Helps } from "@/utils/helps";
import { redirect } from "next/navigation";


const clientFetch = async ({ url, method, body, cache, revalidate, tags, callback, priority }: { url: string, method: "GET" | "POST" | "PUT" | "DELETE", body?: any, cache?: 'force-cache' | 'no-store' | 'default' | null, revalidate?: number | null, tags?: string[] | null, callback?: (response: ResponseUseFetchClient) => void, priority?: "auto" | "high" | "low" }) => {

    const headers = new Headers()
    headers.append("Authorization", `${Helps.client_api_key}`);

    const requestOptions: RequestInit = {
        method: method,
        headers: headers
    };

    if (body) {
        if ((typeof (body?.get) == 'function') && (typeof (body.has) == 'function')) {
            //body is a formData
            requestOptions.body = body;
        } else {
            requestOptions.body = JSON.stringify(body);
        }
    }
    if (cache) {
        requestOptions.cache = cache;
    }
    if (priority) {
        requestOptions.priority = priority;
    }

    let next: any = {}
    if (revalidate) {
        next.revalidate = revalidate;
    }
    if (tags) {
        next.tags = tags;
    }

    requestOptions.next = next;
    console.log("url", url, requestOptions)
    try {
        const res = await fetch(url, requestOptions);
        const data: ResponseUseFetchClient = await res.json();

        if (data.status !== 200 || data.message !== 'SUCCESS!') {
            if (data?.status == Helps.code_authentication) {
                if (IS_SERVER) {
                    await fetch(`${Helps.local_api_url}/api/logout?no_fetch=1`, { method: "GET" })
                    const url_redirect = window.location.href
                    setTimeout(async () => {
                        window.location.assign(`${Helps.local_api_url}/login?redirect=${url_redirect}`)
                    }, 2000)
                    // toast.error('Authentification requis. Vous Serez redirigé pour vous connecter')
                } else {
                    redirect(`${Helps.local_api_url}/login`)
                }
            }
            if (IS_SERVER) {
                // toast.error(data.message)
            } else {
                console.log('error::', data.message)
            }
        }

        if (callback) {
            callback(data);
        } else {
            return data
        }

    } catch (error: any) {
        // if (IS_SERVER) {
        //     toast.error(error.message, {
        //         autoClose: false
        //     })
        // } else {
        //     console.log('error::', error.message)
        // }

        const response = {
            success: false,
            message: error.message,
            status: 500,
            datas: null
        };

        if (callback) {
            callback(response);
        } else {
            return response;
        }
    }
}

export default clientFetch
