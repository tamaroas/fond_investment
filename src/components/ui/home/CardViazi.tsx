import React from 'react'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../card';
import Image from 'next/image';



interface iCard{
    icon: string;
    alt: string;
    title: string;
    content: string;
}

const CardViazi = ({icon, alt, title, content}:iCard) => {
  return (
    <Card>
        <CardHeader>
            <Image src={icon} alt={alt} width={40} height={40} />
            <hr className="w-16 h-1 border border-red-500 bg-red-500"></hr>
            <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
            <p>{content}</p>
        </CardContent>
    </Card>

  )
}

export default CardViazi