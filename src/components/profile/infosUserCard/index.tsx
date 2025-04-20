'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import LogoLink from '@/components/ui/logo-link'
import LogoBtn from '@/components/ui/logo-link/logo-btn'
import { Switch } from '@/components/ui/switch'
import { useUserStore } from '@/store/zustandStores'
import { Avatar } from '@radix-ui/react-avatar'
import { CopyIcon } from '@radix-ui/react-icons'
import { Label } from '@radix-ui/react-label'
import { Pencil } from 'lucide-react'
import React, { useState } from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import EditFormUser from './edit-form-user'

interface Props {
    dictionary: DictionaryType
}

function InfosUserCard(props: Props) {
    const { dictionary } = props
    const { user } = useUserStore()
    const [isOpen, setIsOpen] = useState(false);
    const administrator = user?.administrator
    const customer = user?.customer

    const current_user: Administrator | Customer | null | undefined = customer ? customer : administrator;


    const closeDialog = () => setIsOpen(false);

    return (
        <>
            {
                customer ?
                    <div className=' mt-3 h-auto' >
                        <Card className=' max-w-[320px] min-w-[250px]'>
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                                <CardTitle className="text-sm font-medium w-full">
                                    {'Paramètres De La Plateforme'}
                                </CardTitle>

                            </CardHeader>
                            <CardContent>
                                <table className=' text-xs'>
                                    <tbody>
                                        <tr>
                                            <td className=' font-bold min-w-24'>{dictionary.private_key}</td>
                                            <td>{customer?.privateKey}</td>
                                        </tr>
                                        <tr>
                                            <td className=' font-bold min-w-24'>{dictionary.public_key}</td>
                                            <td>{customer?.publicKey}</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </CardContent>
                            <CardFooter >
                                <div className=' flex flex-col '>
                                    <CardTitle className="text-sm font-medium w-full py-5">
                                        {'Méthodes De Paiement'}
                                    </CardTitle>
                                    <div className=' flex flex-col gap-2'>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="airplane-mode" />
                                            <Label htmlFor="airplane-mode">Orange Money</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="airplane-mode" />
                                            <Label htmlFor="airplane-mode">Mobile Money</Label>
                                        </div>
                                        <div className="flex items-center space-x-2">
                                            <Switch id="airplane-mode" />
                                            <Label htmlFor="airplane-mode">Carte Bancaire</Label>
                                        </div>
                                    </div>
                                </div>
                            </CardFooter>
                        </Card>
                    </div> : null
            }
            <div className=' mt-3 h-auto' >
                <Card className=' max-w-[320px] min-w-[250px]'>
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium w-full">
                            <div className=' my-3 m-auto  w-full flex items-center justify-between'>
                                <LogoBtn />

                                <Dialog open={isOpen} onOpenChange={setIsOpen} >
                                    <DialogTrigger asChild>
                                        <div className={` hover:cursor-pointer hover:opacity-55`}>
                                            <Pencil width={150} color={'red'} />
                                        </div>
                                    </DialogTrigger>
                                    <DialogContent className="sm:max-w-[425px]">
                                        <DialogHeader>
                                            <DialogTitle>{"Editer les informations "}</DialogTitle>
                                        </DialogHeader>
                                        <EditFormUser dictionary={dictionary} setIsOpen={closeDialog} current_user={current_user} />

                                    </DialogContent>
                                </Dialog>

                            </div>
                            {dictionary.profile_title1}
                        </CardTitle>

                    </CardHeader>
                    <CardContent>
                        <table className=' text-xs'>
                            <thead>
                            </thead>
                            <tbody>
                                <tr>
                                    <td className=' font-bold'>{dictionary.name + ' : '}</td>
                                    <td>{current_user?.firstname + ' ' + current_user?.lastname}</td>
                                </tr>
                                <tr>
                                    <td className=' font-bold'>{dictionary.email + ' : '}</td>
                                    <td>{current_user?.email}</td>
                                </tr>
                                {
                                    customer ?
                                        < tr >
                                            <td className=' font-bold'>{dictionary.placeholder_company + ' : '}</td>
                                            <td>{customer?.company}</td>
                                        </tr> : null
                                }
                                {
                                    customer ?
                                        < tr >
                                            <td className=' font-bold'>{'Téléphone :'}</td>
                                            <td>{`(+${customer?.callingCode}) ${customer?.tel}`}</td>
                                        </tr> : null
                                }
                                {
                                    customer ?
                                        < tr >
                                            <td className=' font-bold'>{dictionary.typeid + ' :'}</td>
                                            <td>{`(${customer?.identityType}) ${customer?.identity}`}</td>
                                        </tr> : null
                                }
                            </tbody>
                        </table>

                    </CardContent>
                </Card>
            </div >
        </>

    )
}

export default InfosUserCard
