import Image from 'next/image';
import React from 'react'

interface Section{
    description: React.ReactNode;
    image: string;
    imageRigth: boolean;
}

const Section = ({description,image, imageRigth}:Section) => {
    console.log("datatest",description);
  return (
    <>
         {(imageRigth)? (
            <section className="mx-auto flex flex-col  lg:flex-row w-full justify-between items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
                {description}
                <div className="mt-2 mb-2 lg:mt-16">
                    <Image src={image} alt="alt" width={600} height={300} className="rounded-md" />
                </div>
            </section>
        ):(
            <section className="mx-auto flex flex-col  lg:flex-row w-full justify-between items-center gap-2 py-8 md:py-12 md:pb-8 lg:py-24 lg:pb-6">
                <div className="mt-2 mb-2 lg:mt-16">
                    <Image src={image} alt="IMG_Desc" width={600} height={300} className="rounded-md" />
                </div>
                {description}
            </section>
        )}
    </>
  )
}

export default Section