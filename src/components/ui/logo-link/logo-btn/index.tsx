import Image from "next/image"
import Link from "next/link"


interface Props {
}

export default function LogoBtn(props: Props) {
    const { } = props

    return (
        <div
            className="flex items-center hover:opacity-85 transition-opacity duration-300"
        >
            <Image
                src="/assets/images/.png"
                width={100}
                height={100}
                alt="demo-dark"
                priority
                className="hidden dark:block dark:shadow-gray-500/5"
            />
            <Image
                src="/assets/images/.png"
                width={100}
                height={100}
                alt="demo-dark"
                priority
                className="dark:hidden "
            />
        </div>
    )
}

