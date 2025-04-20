import { api_route } from "@/utils/api_route";
import serverFetch from "@/utils/fetcher/serverFetch";
import { Helps } from "@/utils/helps";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const access_token = req.nextUrl.searchParams.get('access_token')

    let response = await serverFetch("").get(api_route().app.bootstrap);

    if (response.status === 200 && response.message.includes('SUCCESS')) {
        response.success = true;
        response.datas = response?.datas;
    }

    return NextResponse.json(response);

}