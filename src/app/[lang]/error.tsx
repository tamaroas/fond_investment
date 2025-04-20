'use client' // Error components must be Client Components

import Link from 'next/link'
import { useEffect } from 'react'

export default function Error({
    error,
    reset,
}: {
    error: Error
    reset: () => void
}) {
    useEffect(() => {
        console.error(error)
    }, [error])

    return (
        <div className="min-h-screen flex flex-grow items-center justify-center">
            <div className="rounded-lg bg-white p-8 text-center shadow-xl">
                <h1 className="mb-4 text-4xl font-bold">{"404"}</h1>
                <p className="text-gray-600">{"Oops! La page que vous recherchez est introuvable.."}</p>
                <Link href={`/`} className=" "> {" 'accueil"} </Link>
            </div>
        </div>
    )
}