'use client'
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import AddCardWithdrawMthod from "./add-card-withdraw-method"
import AddCardWithdrawal from "./add-card-withdraw-method/AddCardWithdrawal"


interface Props {
    dictionary: DictionaryType,
    withdrawal_methods: WithdrawalMethod[],
    withdrawals:Withdrawal[],
}

interface FusionWithdrawal {
    withdrawal_method: WithdrawalMethod;
    withdrawals: Withdrawal[];
  }

function AddWithdrawMethod(props: Props) {
    const { dictionary, withdrawal_methods, withdrawals } = props


    return (
        <>
            <Card className=' w-full mt-6'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium w-full">
                        {'Moyens De Retrait'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className=" flex flex-wrap gap-3">
                        {
                            withdrawal_methods && withdrawals.map((withdrawal, index) =>
                                <AddCardWithdrawal key={'method_' + withdrawal.id} withdrawal={withdrawal} dictionary={dictionary} />
                            )
                        }
                        {
                            withdrawal_methods && withdrawal_methods.map((withdrawal_method, index) =>
                                <AddCardWithdrawMthod key={'method_' + withdrawal_method.id} withdrawal_method={withdrawal_method} dictionary={dictionary} />
                            )
                        }
                    </div>

                </CardContent>

            </Card>
        </>
    )
}

export default AddWithdrawMethod
