import { LoginformSchema, RegisterformSchema } from "@/lib/zodSchema"
import clientFetch from "@/utils/fetcher/clientFetch"
import { Helps } from "@/utils/helps"
import { z } from "zod"

export async function userAppBootstrap(callback?: CallBackResponseUseFetch) {
    const response = clientFetch({ url: `${Helps.local_api_url}/api/app`, method: "GET", callback: callback, cache: "no-store" })
    if (!callback) {
        return await response
    }
}

export function userServiceLogin(body: z.infer<typeof LoginformSchema>, callback?: CallBackResponseUseFetch) {
    clientFetch({ url: `${Helps.local_api_url}/api/auth/login`, method: "POST", callback: callback, body: body, cache: "no-store" })
}

export function userServiceRegister(body: z.infer<typeof RegisterformSchema>, callback?: CallBackResponseUseFetch) {
    clientFetch({ url: `${Helps.local_api_url}/api/auth/register`, method: "POST", callback: callback, body: body, cache: "no-store" })
}

export function userServiceLogout(callback?: CallBackResponseUseFetch) {
    clientFetch({ url: `${Helps.local_api_url}/api/auth/logout`, method: "GET", callback: callback, cache: "no-store" })
}

export async function userBootstrap(callback?: CallBackResponseUseFetch, params?: string) {
    const response = clientFetch({ url: `${Helps.local_api_url}/api/bootstrap?${params}`, method: "GET", callback: callback, cache: "no-store" })
    if (!callback) {
        return await response
    }
}

export async function userServiceUsers(page: number, callback?: CallBackResponseUseFetch) {
    clientFetch({ url: `${Helps.local_api_url}/api/pagination/users?page=${page}`, method: "GET", callback: callback, cache: "no-store" })
}

export async function userServiceTransactionPageable(page: number, callback?: CallBackResponseUseFetch) {
    clientFetch({ url: `${Helps.local_api_url}/api/pagination/transactions?page=${page}`, method: "GET", callback: callback, cache: "no-store" })
}

export async function userServiceWithdrawalsAdmin(page: number, callback?: CallBackResponseUseFetch) {
    clientFetch({ url: `${Helps.local_api_url}/api/pagination/withdrawalsAdmin?page=${page}`, method: "GET", callback: callback, cache: "no-store" })
}

export async function userServiceUsersPageable(page: number, callback?: CallBackResponseUseFetch) {
    clientFetch({ url: `${Helps.local_api_url}/api/pagination/users?page=${page}`, method: "GET", callback: callback, cache: "no-store" })
}

export async function userServiceWalletTransactionsPageable(page: number, callback?: CallBackResponseUseFetch) {
    clientFetch({ url: `${Helps.local_api_url}/api/pagination/wallet?page=${page}`, method: "GET", callback: callback, cache: "no-store" })
}

// //service withdrawal
// /* withdrawal method */
// export async function userServiceWidrawalMethodAddom(body: z.infer<typeof WithdrawalMethodOmformSchema>, callback?: CallBackResponseUseFetch) {
//     clientFetch({ url: `${Helps.local_api_url}/api/withdrawals/add/om`, method: "POST", callback: callback, body: body, cache: "no-store" })
// }

// export async function userServiceWidrawalMethodAddmomo(body: z.infer<typeof WithdrawalMethodMomoformSchema>, callback?: CallBackResponseUseFetch) {
//     clientFetch({ url: `${Helps.local_api_url}/api/withdrawals/add/momo`, method: "POST", callback: callback, body: body, cache: "no-store" })
// }

// export async function userServiceWidrawalMethodAdd(body: z.infer<typeof WithdrawalMethodBankformSchema>, callback?: CallBackResponseUseFetch) {
//     clientFetch({ url: `${Helps.local_api_url}/api/withdrawals/add/bank`, method: "POST", callback: callback, body: body, cache: "no-store" })
// }
// /* end withdrawal method */

// export async function userServiceIntialwithdrawal(body: z.infer<typeof InitializeWithdrawalformSchema>, callback?: CallBackResponseUseFetch) {
//     clientFetch({ url: `${Helps.local_api_url}/api/withdrawals/widrawal`, method: "POST", callback: callback, body: body, cache: "no-store" })
// }

// export async function userServiceCancelwidrawal(id: number, callback?: CallBackResponseUseFetch) {
//     clientFetch({ url: `${Helps.local_api_url}/api/withdrawals/cancel?id=${id}`, method: "GET", callback: callback, cache: "no-store" })
// }

// export async function userServicedeletewidrawalmethod(id: number, callback?: CallBackResponseUseFetch) {
//     clientFetch({ url: `${Helps.local_api_url}/api/withdrawals/delete?id=${id}`, method: "GET", callback: callback, cache: "no-store" })
// }

// export async function userServiceValidateWithdrawal(id: number, callback?: CallBackResponseUseFetch) {
//     clientFetch({ url: `${Helps.local_api_url}/api/withdrawals/validate?id=${id}`, method: "GET", callback: callback, cache: "no-store" })
// }

// export async function userServiceChangeStatutWithdrawal(id: number, callback?: CallBackResponseUseFetch) {
//     clientFetch({ url: `${Helps.local_api_url}/api/withdrawals/changeStatut?id=${id}`, method: "GET", callback: callback, cache: "no-store" })
// }

// export async function userServiceWidrawalValideSend(id: number, body: z.infer<typeof ValidateWithdrawalformSchema>, callback?: CallBackResponseUseFetch) {
//     clientFetch({ url: `${Helps.local_api_url}/api/withdrawals/send?id=${id}`, method: "POST", callback: callback, body: body, cache: "no-store" })
// }