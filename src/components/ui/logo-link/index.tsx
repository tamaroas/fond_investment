import Image from "next/image"
import Link from "next/link"


interface Props {
    href: string,
}

export default function LogoLink(props: Props) {
    const { href } = props

    return (
        <Link
            prefetch={true}
            href={href}
            className="flex items-center hover:opacity-85 transition-opacity duration-300"
        >
            <Image
                src="/assets/images/Viazi-PAY2.png"
                width={200}
                height={100}
                alt="demo-dark"
                priority
                className="hidden dark:block dark:shadow-gray-500/5"
            />
            <Image
                src="/assets/images/Viazi-PAY.png"
                width={200}
                height={100}
                alt="demo-dark"
                priority
                className="dark:hidden "
            />
        </Link>
    )
}

