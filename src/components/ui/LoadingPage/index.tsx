import React from 'react'

interface Props { }

export default function LoadingPage(props: Props) {
    const { } = props

    return (
        <div className=' w-full h-full flex items-center justify-center bg-zinc-50 dark:bg-zinc-900'>
            <div className=' flex flex-col items-center '>
                <div>
                    <svg width="100" height="70" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><circle cx="4" cy="12" r="3"><animate id="spinner_qFRN" begin="0;spinner_OcgL.end+0.25s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33" /></circle><circle cx="12" cy="12" r="3"><animate begin="spinner_qFRN.begin+0.1s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33" /></circle><circle cx="20" cy="12" r="3"><animate id="spinner_OcgL" begin="spinner_qFRN.begin+0.2s" attributeName="cy" calcMode="spline" dur="0.6s" values="12;6;12" keySplines=".33,.66,.66,1;.33,0,.66,.33" /></circle></svg>
                </div>
                <p className=' text-sm font-bold dark:text-gray-300'>Loaoding </p>
            </div>
        </div>
    )
} 