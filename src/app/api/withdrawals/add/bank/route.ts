import { api_route } from "@/utils/api_route";
import { userCookies } from "@/utils/cookies";
import serverFetch from "@/utils/fetcher/serverFetch";
import { Helps } from "@/utils/helps";
import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";

const schema = Joi.object({
    id_withdrawal_method: Joi.number().min(1).required(),
    full_name: Joi.string().min(5).required(),
    password: Joi.string().required().min(8),
    bank_number: Joi.string().min(4),
    bank_iban: Joi.string().min(10),
    bank_swift: Joi.string().min(4),
})

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {


    const token = req.headers.get('authorization');
    if (token !== Helps.client_api_key) {
        return NextResponse.json({
            success: false,
            status: 401,
            message: 'Authorization token is missing or invalid',
            data: {}
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

    const response = await serverFetch().post(api_route().withdrawals.add, body);

    return NextResponse.json(response);
}