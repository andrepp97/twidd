import Link from 'next/link'
import { useRouter } from 'next/router'
import { SVGProps } from 'react'

interface SidebarProps {
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
    title: string
    path: string
}

const SidebarItem = ({ Icon, title, path }: SidebarProps) => {
    // Hooks
    const { pathname } = useRouter()

    // Render
    return (
        <Link href={path} passHref={true}>
            <div className={`text-gray-300 flex items-center justify-center sm:justify-start space-x-2 px-3 sm:px-6 py-3 cursor-pointer rounded-full hover:text-zinc-100 hover:bg-zinc-700 transition-all duration-200 ${pathname == path && 'bg-zinc-700 text-zinc-100 font-semibold'}`}>
                <Icon className='w-5 sm:w-6 h-5 sm:h-6' />
                <p className='hidden md:inline-flex lg:text-lg'>
                    {title}
                </p>
            </div>
        </Link>
    );
}

export default SidebarItem;