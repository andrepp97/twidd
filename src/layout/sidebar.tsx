import Link from 'next/link'
import Image from 'next/image'
import { useState } from 'react'
import { useSession, signOut } from 'next-auth/react'
import {
    HomeIcon,
    HashtagIcon,
    BellIcon,
    MailIcon,
    UserIcon,
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
        title: "Explore",
        icon: HashtagIcon,
        path: "/explore",
    },
    {
        title: "Notifications",
        icon: BellIcon,
        path: "/notifications",
    },
    {
        title: "Messages",
        icon: MailIcon,
        path: "/messages",
    },
    {
        title: "Profile",
        icon: UserIcon,
        path: "/profile",
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
        <aside className='min-h-screen min-w-fit flex flex-col justify-between border-r border-zinc-700 space-y-2 px-1 md:px-6 py-5'>

            <div>
                <Link href={"/"} passHref={true}>
                    <div className='w-full flex justify-center sm:justify-start sm:ml-6 mb-6'>
                        <Image
                            className='text-gray-300 cursor-pointer'
                            src={TwitterIcon}
                            height={22}
                            width={28}
                        />
                    </div>
                </Link>
                <div className='space-y-1 my-6'>
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
                    className='text-zinc-100 bg-[#1D9BF0] hover:bg-[#1A8CD8] transition-all duration-200 p-2 rounded-full font-semibold tracking-wide w-fit md:w-full flex items-center justify-center mx-auto'
                >
                    <p className='hidden md:inline'>Tweet</p>
                    <PencilIcon className='w-5 h-5 md:hidden' />
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