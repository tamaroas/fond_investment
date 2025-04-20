import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

import React from 'react'

interface Props {
    symbole: React.ReactNode,
    title: string,
    value?: React.ReactNode,
    description?: React.ReactNode
}

function MoneyCard(props: Props) {
    const { symbole, value, description, title } = props

    return (
        <>
            <Card className=' max-w-[320px] min-w-[300px]'>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-sm font-medium">
                        {title}
                    </CardTitle>
                    {symbole}
                </CardHeader>
                <CardContent>
                    {value ? <div className="text-2xl font-bold">{value}</div> : null}
                    {
                        description ? <p className="text-xs text-muted-foreground">
                            {description}
                        </p> : null
                    }
                </CardContent>
            </Card>

        </>
    )
}

export default MoneyCard
