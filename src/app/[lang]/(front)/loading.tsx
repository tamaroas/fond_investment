import LoadingPage from '@/components/ui/LoadingPage'
import React from 'react'

interface Props { }

function Loading(props: Props) {
    const { } = props

    return (
        <div className=' w-full h-[calc(100vh_-_56px)]'>
            <LoadingPage />
        </div>
    )
}

export default Loading
