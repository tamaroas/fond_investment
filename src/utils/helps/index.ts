export const Helps: Help = {
    code_authentication: 402,
    local_api_url: process.env.NEXT_PUBLIC_LOCAL_API_URL,
    api_key: process.env.NEXT_PUBLIC_APP_ENV == 'production' ? process.env.NEXT_PUBLIC_API_KEY : process.env.NEXT_PUBLIC_DEV_API_KEY,
    api_url: process.env.NEXT_PUBLIC_APP_ENV == 'production' ? process.env.NEXT_PUBLIC_API_URL : process.env.NEXT_PUBLIC_DEV_API_URL,
    client_api_key: process.env.NEXT_PUBLIC_CLIENT_API_KEY
};
