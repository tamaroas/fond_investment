import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'

import React from 'react'

interface Props {
    dictionary: DictionaryType,
    bootstrapDatas: BootstrapUserInfo
}

export default function PaimentSettings(props: Props) {
    const { dictionary, bootstrapDatas } = props
    const withdrawal_methods = bootstrapDatas?.withdrawal_methods
    const payment_methods = bootstrapDatas?.payment_methods

    return (
        <>
            <Card className=' w-full'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-base font-medium">
                        {'Paramètres De La Plateforme'}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className=''>
                        <div>
                            <CardTitle className="text-sm font-medium uppercase my-4">
                                {'Paramètres De La Plateforme'}
                            </CardTitle>
                            <div>
                                {
                                    payment_methods?.map((payment_method, index) =>
                                        <div key={'payment_method_' + payment_method?.id} className="flex items-center space-x-2 my-2">
                                            <Switch id="airplane-mode" />
                                            <Label htmlFor="airplane-mode">{payment_method?.name}</Label>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                        <CardTitle className="text-sm font-medium uppercase my-4">
                            {'Méthodes De Retrait'}
                        </CardTitle>
                        <div>
                            {
                                withdrawal_methods?.map((withdrawal_method, index) =>
                                    <div key={'withdrawal_methods_' + withdrawal_method.id} className="flex items-center space-x-2 my-2">
                                        <Switch id="airplane-mode" />
                                        <Label htmlFor="airplane-mode">{withdrawal_method.name}</Label>
                                    </div>
                                )
                            }
                        </div>
                    </div>

                </CardContent>
            </Card>

        </>
    )
} 
