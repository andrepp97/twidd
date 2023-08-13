import Link from 'next/link'
import { useRouter } from 'next/router'
import { SVGProps } from 'react'

interface SidebarProps {
    Icon: (props: SVGProps<SVGSVGElement>) => JSX.Element
    title: string
    path: string | null
    clickFunction: any
}

const SidebarItem = ({ Icon, title, path, clickFunction }: SidebarProps) => {
    // Hooks
    const { pathname, query } = useRouter()
    const { id }: any = query

    const newPath = query?.id ? pathname.replace('[id]', id) : pathname

    // Render
    return path
        ? (
            <Link href={path} passHref={true}>
                <div className={`text-gray-300 flex items-center justify-center sm:justify-start gap-x-2 px-2 sm:px-6 py-2 sm:py-3 cursor-pointer rounded-full hover:text-zinc-100 hover:bg-zinc-700 transition-all duration-200 ${newPath == path && 'bg-zinc-700 text-zinc-100 font-semibold'}`}>
                    <Icon className='w-6 h-6' />
                    <p className='hidden md:inline-flex lg:text-lg'>
                        {title}
                    </p>
                </div>
            </Link>
        )
        : (
            <div
                onClick={clickFunction}
                className={`text-gray-300 flex items-center justify-center sm:justify-start gap-x-2 px-2 sm:px-6 py-2 sm:py-3 cursor-pointer rounded-full hover:text-zinc-100 hover:bg-zinc-700 transition-all duration-200 ${newPath == path && 'bg-zinc-700 text-zinc-100 font-semibold'}`}
            >
                <Icon className='w-6 h-6' />
                <p className='hidden md:inline-flex lg:text-lg'>
                    {title}
                </p>
            </div>
        );
}

export default SidebarItem;