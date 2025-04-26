'use client'

import flag_fr from '@/assets/images/fr.svg'
import flag_en from '@/assets/images/us.svg'
import useLanguageStore from '@/store/languageStore'
import { Langs } from '@/utils/langs-config';
import { useParams } from 'next/navigation';
import React from 'react'
import Link from 'next/link';


interface Props{

}

export function LanguageSelector(props : Props){
    const {} =  props;
    const {lang} : { lang: Langs } = useParams()

    const langs = [
        {
            id : 1,
            name: 'Français',
            iso: "FR",
            flag: flag_fr
        },
        {
            id : 2,
            name: 'Englais',
            iso: "EN",
            flag: flag_en
        }
    ]


//  const path = (() => {
//     if(typeof Window != undefined){
//         let pathname = window.location.pathname.split('/').slice(2).join('/') + "/"
//         return pathname + window.location.search
//     }
//  })()

const curren_lang = langs.find(_lang => _lang.iso.toLocaleLowerCase() === lang.toLocaleLowerCase()) ?? langs[0]
    return (
        <ul className='relative capitalize py-2 pl-2 max-sm:m-auto group'>
            <div className=' flex gap-1 bg-white-sfo p-1 px-2 cursor-pointer hover:opacity-75 text-base w-12 shadow' >
                <img src={curren_lang.flag.src} width={12} height={12} alt={curren_lang.name} />
                <span>{curren_lang.iso}</span>
            </div>
            <div className={`absolute flex flex-col gap-1 right-0 w-12 bg-white-sfo shadow overflow-hidden max-h-0  group-hover:max-h-screen transition-all duration-500`}>
                <div className='p-1 py-2'>
                    {
                        langs.map(_lang =>
                            <div key={_lang.id} className=''>
                                <li><Link href={`/${_lang.iso.toLocaleLowerCase() + '/'}`} className={`flex  gap-1 ${curren_lang.id === _lang.id ? ' cursor-not-allowed opacity-50' : 'hover:underline hover:text-blue-sfo'}`}>
                                        <img src={_lang.flag.src} width={12} height={12} alt={_lang.name} />
                                        <span>{_lang.iso}</span>
                                    </Link>
                                </li>
                            </div>
                        )}
                </div>
            </div>

        </ul >
      )
}
