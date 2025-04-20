import { api_route } from "@/utils/api_route";
import serverFetch from "@/utils/fetcher/serverFetch";
import { Helps } from "@/utils/helps";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const access_token = req.nextUrl.searchParams.get('access_token')

    const token = req.headers.get('authorization');
    if (token !== Helps.client_api_key) {
        return NextResponse.json({
            success: false,
            status: 401,
            message: 'Authorization token is missing or invalid',
            data: {}
        });
    }

    let response
    if (access_token && access_token != '') {
        response = await serverFetch(access_token).get(api_route().dashboard.user_bootstrap);
    } else {
        response = await serverFetch().get(api_route().dashboard.user_bootstrap);
    }

    if (response.status === 200 && response.message.includes('SUCCESS')) {
        response.success = true;
        response.datas = response?.datas;
    }

    return NextResponse.json(response);

}