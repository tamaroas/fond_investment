import { api_route } from "@/utils/api_route";
import { userCookies } from "@/utils/cookies";
import serverFetch from "@/utils/fetcher/serverFetch";
import { Helps } from "@/utils/helps";
import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";

export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {


    const token = req.headers.get('authorization');
    if (token !== Helps.client_api_key) {
        return NextResponse.json({
            success: false,
            status: 401,
            message: 'Authorization token is missing or invalid',
            datas: {}
        });
    }

    const response = {success: true, status: 200, message:'SUCCESS'}

    // const response = await serverFetch().get(api_route().auth.logout);
    if (response.status === 200 && response.message.includes('SUCCESS')) {
        response.success = true
        userCookies.deleteAccessToken("access_token");
    }

    
    return NextResponse.json(response);
}