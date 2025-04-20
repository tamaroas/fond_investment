import { cookies } from "next/headers";

export const userCookies: CustomCookie = {
    get access_token() {
        return cookies().has("access_token") ? cookies().get("access_token")?.value ?? null : null
    },
    set access_token(value: string | null) {
        cookies().set("access_token", `${value}`/*, {secure: true}*/)
    },
    deleteAccessToken(key: string) {
        cookies().delete(key);
    },
    setAccessTokenWithExpiry(value: string | null, maxAge: number) {
        cookies().set("access_token", `${value}`, { maxAge });
    }
} 
