export function is_formdata(body: any) {
    if ((typeof (body?.get) == 'function') && (typeof (body.has) == 'function')) {
        return true;
    }
    return false;
}

export const IS_SERVER = typeof window !== 'undefined' ? true : false