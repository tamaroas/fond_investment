import { api_route } from "@/utils/api_route";
import { userCookies } from "@/utils/cookies";
import serverFetch from "@/utils/fetcher/serverFetch";
import { Helps } from "@/utils/helps";
import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";

const schema = Joi.object({
    email: Joi.string().min(8).required(),
    password: Joi.string().required().min(8),
    remember: Joi.optional(),
})

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {


    const token = req.headers.get('authorization');
    if (token !== Helps.client_api_key) {
        return NextResponse.json({
            success: false,
            status: 401,
            message: 'Authorization token is missing or invalid',
            datas: {}
        });
    }

    const body = await req.json();

    const { error } = schema.validate(body)

    if (error) {
        return NextResponse.json({
            success: false,
            message: error.details[0].message,
            datas: {}
        });
    }

    userCookies.access_token = '';

    const response = await serverFetch().post(api_route().auth.login, body);
    if (response.status === 200 && response.message.includes('SUCCESS')) {
        response.success = true
        userCookies.setAccessTokenWithExpiry(response?.datas?.access_token, response?.datas.expirer)
    }

    return NextResponse.json(response);
}