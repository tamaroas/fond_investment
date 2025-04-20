import { api_route } from "@/utils/api_route";
import serverFetch from "@/utils/fetcher/serverFetch";
import { Helps } from "@/utils/helps";
import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id');

    const token = req.headers.get('authorization');
    if (token !== Helps.client_api_key) {
        return NextResponse.json({
            success: false,
            status: 401,
            message: 'Authorization token is missing or invalid',
            data: {}
        });
    }

    let response = await serverFetch().get(api_route().withdrawals.validate.replace('[ID]',id?? "0"));
        
    if (response.status === 200 && response.message.includes('SUCCESS')) {
        response.success = true;
        response.datas = response?.datas;
    }

    return NextResponse.json(response);

}