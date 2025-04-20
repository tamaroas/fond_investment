"use client";

import React from 'react'
import InfosUserCard from './infosUserCard'
import ProfileForm from './ProfileForm'
import AddWithdrawMethod from './add-withdraw-method'
import { useUserStore } from '@/store/zustandStores'

interface Props {
    dictionary: DictionaryType,
    bootstrapDatas: BootstrapUserInfo
}

function Profile(props: Props) {
    const { dictionary, bootstrapDatas } = props
    const {user} = useUserStore()

    const isCustomer = (user: ViaziCustomer | null) => {
        return user?.customer ?? false
    }

    const withdrawal_methods = bootstrapDatas?.withdrawal_methods
    const withdrawals = bootstrapDatas?.withdrawals

    return (
        <>
            <div className=' w-full lg:flex gap-4 flex flex-wrap' >
                <InfosUserCard dictionary={dictionary} />
                <ProfileForm dictionary={dictionary} />
            </div>
            {isCustomer(user)&&(
                <AddWithdrawMethod dictionary={dictionary} withdrawal_methods={withdrawal_methods} withdrawals={withdrawals} />
            )}
        </>
    )
}

export default Profile
