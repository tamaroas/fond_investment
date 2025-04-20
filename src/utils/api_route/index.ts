
import { Helps } from "../helps";



const url_api = Helps.api_url
export function api_route() {

    return {
        app:{
            bootstrap:`${url_api}/bootstrap`,
        },
        auth: {
            login: `${url_api}/auth/login`,
            register: `${url_api}/auth/register1`,
            logout: `${url_api}/auth/logout`,
        },
        dashboard: {
            user_bootstrap:`${url_api}/user/bootstrap`,
        },
        pagination: {
            transaction: `${url_api}/pagination/transactions/[PAGE]`,
            withdrawals_admin: `${url_api}/pagination/withdrawals/[PAGE]`,
            users: `${url_api}/pagination/customers/[PAGE]`,
            wallet: `${url_api}/pagination/wallet_transactions/[PAGE]`
        },
        withdrawals: {
            add: `${url_api}/withdrawal/add`,                                //add withdrawal method in dashborad/profile
            widrawal:`${url_api}/withdrawal`,                                //initial withdrawal 
            delete:`${url_api}/withdrawal/delete/[ID]`,                      //delete the withdrawal method in dashborad/profile
            validate:`${url_api}/withdrawal/validate/[ID]`,                  //validate withdrawal
            change_statut: `${url_api}/withdrawal/change-status/[ID]`,       
            cancel:`${url_api}/withdrawal/cancel/[ID]`,
            send:`${url_api}/withdrawal/send/[ID]`
        }
    }

}