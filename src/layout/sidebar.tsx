import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import {
    HomeIcon,
    UserIcon,
    BellIcon,
    MailIcon,
    PencilIcon,
} from '@heroicons/react/outline'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import TwitterIcon from '../../public/twitter.png'
import SidebarItem from '../components/sidebarItem'
import UserProfile from '../components/userInfo'
import TweetBox from '../components/tweetBox'
import Modal from '../components/modal'

const sidebarItems = [
    {
        title: "Home",
        icon: HomeIcon,
        path: "/",
    },
    {
        title: "Profile",
        icon: UserIcon,
        path: "/profile",
    },
    {
        title: "Messages",
        icon: MailIcon,
        path: "/messages",
    },
    {
        title: "Notifications",
        icon: BellIcon,
        path: "/notifications",
    },
]

const Sidebar = () => {
    // Hooks
    const { data: session }: any = useSession()
    const [open, setOpen] = useState(false)
    const [isOpen, setIsOpen] = useRecoilState(modalState)

    // Function
    const userSignout = () => {
        signOut()
        setOpen(false)
    }

    // Render
    return (
        <aside className='fixed sm:relative bottom-0 sm:min-h-screen w-full sm:w-fit min-w-max sm:min-w-fit flex items-center flex-row-reverse sm:flex-col justify-between border-t sm:border-r border-zinc-700 bg-zinc-900 gap-x-2 p-3 md:px-6 sm:py-5 z-10'>

            <div className='sm:hidden'>
                <button
                    onClick={() => setIsOpen("tweet")}
                    className='text-zinc-100 bg-[#1D9BF0] hover:bg-[#1A8CD8] transition-all duration-200 rounded-full p-2'
                >
                    <PencilIcon className='w-6 h-6' />
                </button>
            </div>

            <div className='flex items-center sm:inline m-0'>
                <div className='hidden sm:flex justify-center sm:justify-start sm:ml-6 mb-6'>
                    <Link
                        href={"/"}
                        passHref={true}
                    >
                        <Image
                            className='text-gray-300 cursor-pointer'
                            src={TwitterIcon}
                            height={22}
                            width={28}
                            alt=""
                        />
                    </Link>
                </div>
                <div className='flex sm:flex-col sm:items-start items-center gap-2 sm:my-6'>
                    {sidebarItems.map((item, index) => (
                        <SidebarItem
                            key={index}
                            Icon={item.icon}
                            title={item.title}
                            path={item.path}
                        />
                    ))}
                </div>
                <button
                    onClick={() => setIsOpen("tweet")}
                    className='text-zinc-100 bg-[#1D9BF0] hover:bg-[#1A8CD8] transition-all duration-200 p-2 rounded-full font-semibold tracking-wide w-fit md:w-full hidden sm:flex items-center justify-center h-fit mx-auto'
                >
                    <p className='hidden md:inline'>Tweet</p>
                    <PencilIcon className='w-6 h-6 md:hidden' />
                </button>
            </div>

            <UserProfile
                open={open}
                session={session}
                signout={userSignout}
                openMenu={() => setOpen(prev => !prev)}
            />

            {isOpen === "tweet" && (
                <Modal>
                    <TweetBox />
                </Modal>
            )}

        </aside>
    );
}

export default Sidebar;