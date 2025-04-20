
'use client'
import React from 'react'
import MoneyCard from './MoneyCard'
import { AreaGraph } from '@/components/charts/area-graph'
import { PieGraph } from '@/components/charts/pie-graph'

interface Props {
    dictionary: DictionaryType,
    BootstrapUserInfo: BootstrapUserInfo,
}

function Dashboard(props: Props) {
    const { dictionary, BootstrapUserInfo } = props
    console.log('BootstrapUserInfo', BootstrapUserInfo)
    const wallet = BootstrapUserInfo?.wallet
    const transactions = BootstrapUserInfo?.transactions
    const wallet_transactions = BootstrapUserInfo?.wallet_transactions
    const currencies = BootstrapUserInfo?.currencies
    console.log(currencies)

    return (
        <div>

            <div className=' flex gap-4 flex-wrap '>
                <MoneyCard
                    title={dictionary.wallet}
                    value={wallet?.amount + ' ' + wallet.currency?.symbol}
                    symbole={
                        wallet.currency?.symbol
                    }
                />
                <MoneyCard
                    title={dictionary.wallet + ' OM'}
                    value={wallet.omAmount + ' ' + wallet.currency?.symbol}
                    symbole={
                        wallet.currency?.symbol
                    }
                />
                <MoneyCard
                    title={dictionary.wallet + ' MOMO'}
                    value={wallet.momoAmount + ' ' + wallet.currency?.symbol}
                    symbole={
                        wallet.currency?.symbol
                    }
                />
                <MoneyCard
                    title={dictionary.wallet + ' CART'}
                    value={wallet.cartAmount?.toFixed(2) + ' ' + wallet.currency?.symbol}
                    symbole={
                        wallet.currency?.symbol
                    }
                />
                <MoneyCard
                    title={dictionary.transactions}
                    value={transactions.totalElements + ' '}
                    symbole={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    }
                />
                <MoneyCard
                    title={dictionary.transactions + ' Wallet'}
                    value={wallet_transactions.totalElements + ' '}
                    symbole={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="h-4 w-4 text-muted-foreground"><path d="M22 12h-4l-3 9L9 3l-3 9H2"></path></svg>
                    }
                />

                <MoneyCard
                    title={dictionary.currency + ' Wallet'}
                    symbole={
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" className="h-4 w-4 text-muted-foreground"><rect width="20" height="14" x="2" y="5" rx="2"></rect><path d="M2 10h20"></path></svg>
                    }
                    description={
                        <table  >
                            <thead>
                                <tr>
                                    <th className=' px-2 pl-0 font-bold'>{dictionary.currency}</th>
                                    <th className=' px-2 font-bold'>{'Achat ( FCFA )'}</th>
                                    <th className=' px-2 font-bold'>{'Echange ( FCFA )'}</th>
                                </tr>
                            </thead>
                            <tbody className=' text-xs'>
                                {
                                    currencies?.length > 0 ? currencies.map((currency, index) =>
                                        <tr key={'currency_' + index}>
                                            <td>{currency.isoCode}</td>
                                            <td className=' px-2'>{currency.rateWithout}</td>
                                            <td className=' px-2'>{currency.rate}</td>
                                        </tr>
                                    ) : null
                                }
                                {/* <tr>{currencies}</tr> */}
                            </tbody>

                        </table>
                    }
                />

            </div>
            <div className="col-span-4 mt-4">
                <AreaGraph />
            </div>
            {/* <div className="col-span-4 md:col-span-3">
                <PieGraph />
            </div> */}
        </div>
    )
}

export default Dashboard
