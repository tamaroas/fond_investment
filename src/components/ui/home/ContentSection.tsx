import Link from 'next/link';
import React from 'react'
import { Button } from '../button';

interface contentSection {
    title: string | React.ReactNode;
    content: string;
    textbutton: string;
}

const ContentSection = ({title,content,textbutton}:contentSection) => {
  return (
    <div className="flex flex-col gap-10 lg:mt-10 lg:ml-16 md:max-w-[50%] justify-center items-center font-bold lg:justify-start lg:items-start">
            {typeof title == "string" ?(
                <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
                    {title}
                </h1>
            ):(
                <h1 className="text-center text-3xl font-bold leading-tight tracking-tighter md:text-5xl lg:leading-[1.1]">
                    {title}
                </h1>
            ) }
            
            <div className="flex flex-col mt-3 mb-1 lg:ml-6 text-sm lg:text-md justify-center text-center items-center  lg:justify-start lg:items-start lg:text-start lg:max-w-md">
                <p className="mt-1 mb-1 self-center">{content}</p>
                <Link href="/register"
                   className="self-center py-8"
                >
                    <Button >{textbutton}</Button>
                </Link>
            </div>
    </div>
  )
}

export default ContentSection