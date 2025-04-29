import { LoginformSchema, RegisterformSchema, TypeAddClientFormShema } from "@/lib/zodSchema"
import clientFetch from "@/utils/fetcher/clientFetch"
import { Helps } from "@/utils/helps"
import { z } from "zod"

export async function addUserService(body: TypeAddClientFormShema, callback?: CallBackResponseUseFetch) {
    const resp = await clientFetch({ url: `${Helps.local_api_url}/api/admin/users`, method: "POST", callback: callback, body: body, cache: "no-store" })
    if (!callback) {
        return resp
    }
}

export async function editUserService(body: TypeAddClientFormShema, callback?: CallBackResponseUseFetch) {
    const resp = await clientFetch({ url: `${Helps.local_api_url}/api/admin/users`, method: "PUT", callback: callback, body: body, cache: "no-store" })
    if (!callback) {
        return resp
    }
}

export async function changeStatusService(id: number, active: boolean, callback: CallBackResponseUseFetch) {
    clientFetch({ url: `${Helps.local_api_url}/api/admin/users?active=${active ? 1 : 0}&id=${id}`, method: "PATCH", callback: callback, cache: "no-store" })
}

export async function getAllUserService(callback?: CallBackResponseUseFetch) {
    const resp = await clientFetch({ url: `${Helps.local_api_url}/api/admin/users`, method: "GET", callback: callback, cache: "no-store" })

    if (!callback) {
        return resp
    }
}

export async function getSingleUserService(id: number, callback?: CallBackResponseUseFetch) {
    const resp = await clientFetch({ url: `${Helps.local_api_url}/api/admin/users?id=${id}`, method: "GET", callback: callback, cache: "no-store" })
    if (!callback) {
        return resp
    }
} 