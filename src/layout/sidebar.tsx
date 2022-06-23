import Link from 'next/link'
import Image from 'next/image'
import {
    HomeIcon,
    HashtagIcon,
    BellIcon,
    MailIcon,
    UserIcon,
} from '@heroicons/react/outline'
import SidebarItem from '../components/sidebarItem'
import TwitterIcon from '../../public/twitter.png'

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
    return (
        <aside className='min-h-screen border-r border-zinc-700 space-y-2 w-max px-2 md:px-6 py-6'>
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
            {sidebarItems.map((item, index) => (
                <SidebarItem
                    key={index}
                    Icon={item.icon}
                    title={item.title}
                    path={item.path}
                />
            ))}
        </aside>
    );
}

export default Sidebar;