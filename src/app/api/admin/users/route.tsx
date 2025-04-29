import { api_route } from "@/utils/api_route";
import serverFetch from "@/utils/fetcher/serverFetch";
import { Helps } from "@/utils/helps";
import { ActionGetUsers } from "@/utils/type/otherType";
import Joi from "joi";
import { NextRequest, NextResponse } from "next/server";

const schema = Joi.object({
    adresse: Joi.string().required(),
    dateNaissance: Joi.string().required(),
    email: Joi.string().email().required(),
    gestionnaireId: Joi.string().required(),
    lieuNaissance: Joi.string().required(),
    mot2passe: Joi.string().required(),
    nationalite: Joi.string().required(),
    nom: Joi.string().required(),
    numeroCni: Joi.string().required(),
    prenom: Joi.string().required(),
    sexe: Joi.string().valid('MASCULIN', 'FEMININ').required(),
    telephone: Joi.string().required(),
})

export const dynamic = 'force-dynamic';

export async function POST(req: NextRequest) {

    const body = await req.json();

    const { error } = schema.validate(body)

    if (error) {
        return NextResponse.json({
            success: false,
            message: error.details[0].message,
            datas: {}
        });
    }

    const response = await serverFetch().post(api_route().user.add, body);
    return NextResponse.json(response);
}

export async function GET(req: NextRequest) {
    const type = req.nextUrl.searchParams.get('type') as ActionGetUsers
    const id = req.nextUrl.searchParams.get('id');
    const number = req.nextUrl.searchParams.get('number');

    let response
    switch (type) {
        case ActionGetUsers.by_bumber:
            response = await serverFetch().get(api_route().user.getByNumber.replace('{numero}', number?.toString() ?? ''));
            break;
        case ActionGetUsers.by_manage:
            response = await serverFetch().get(api_route().user.getByManage.replace('{id}', id?.toString() ?? ''));
            break;
        case ActionGetUsers.single:
            response = await serverFetch().get(api_route().user.getSingle.replace('{id}', id?.toString() ?? ''));
            break;
        default:
            response = await serverFetch().get(api_route().user.add);
            break;
    }

    return NextResponse.json(response);
}
export async function PATCH(req: NextRequest) {
    const active = parseInt(req.nextUrl.searchParams.get('active') ?? '0')
    const id = req.nextUrl.searchParams.get('id') ?? ''

    let response
    if (active === 1) {
        response = await serverFetch().get(api_route().user.enabled.replace('{id}', id));
    } else {
        response = await serverFetch().get(api_route().user.disabled.replace('{id}', id));
    }
    return NextResponse.json(response);
}

export async function PUT(req: NextRequest) {
    const id = req.nextUrl.searchParams.get('id') ?? ''
    const body = await req.json();

    const { error } = schema.validate(body)

    if (error) {
        return NextResponse.json({
            success: false,
            message: error.details[0].message,
            content: {}
        });
    }
    const response = await serverFetch().put(api_route().user.edit.replace('{id}', id), body)
    console.log('responseresponse', response)

    return NextResponse.json(response);
}