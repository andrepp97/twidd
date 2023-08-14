import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { useSession, signOut } from 'next-auth/react'
import {
    query,
    getDocs,
    orderBy,
    startAt,
    endAt,
    collection,
    DocumentData,
} from "@firebase/firestore"
import { db } from '../lib/firebase'
import {
    HomeIcon,
    UserIcon,
    BellIcon,
    MailIcon,
    PencilIcon,
    SearchIcon,
} from '@heroicons/react/outline'
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import TwitterIcon from '../../public/twitter.png'
import SidebarItem from '../components/sidebarItem'
import UserProfile from '../components/userInfo'
import TweetBox from '../components/tweetBox'
import Modal from '../components/modal'


const Sidebar = () => {
    // Hooks
    const { data: session }: any = useSession()
    const [width, setWidth] = useState<number>(0)
    const [open, setOpen] = useState<boolean>(false)
    const [searchText, setSearchText] = useState<string>('')
    const [results, setResults] = useState<Array<any> | null>(null)
    const [isOpen, setIsOpen] = useRecoilState(modalState)

    const sidebarItems = [
        {
            title: "Home",
            icon: HomeIcon,
            path: "/",
            show: true,
        },
        {
            title: "Search",
            icon: SearchIcon,
            path: null,
            onClick: () => setIsOpen('search'),
            show: width < 1024,
        },
        {
            title: "Profile",
            icon: UserIcon,
            path: `/profile/${session?.user?.uid}`,
            show: true,
        },
        {
            title: "Messages",
            icon: MailIcon,
            path: "/messages",
            show: width >= 640,
        },
        {
            title: "Notifications",
            icon: BellIcon,
            path: "/notifications",
            show: width >= 640,
        },
    ]

    // Functions
    const onSearch = async () => {
        let users: DocumentData[] = []
        const userQuery = query(collection(db, "users"), orderBy('tag'), startAt(searchText.toLowerCase()), endAt(searchText.toLowerCase() + '\uf8ff'))
        const result = await getDocs(userQuery)
        result.forEach((doc) => users.push(doc.data()))
        setResults(users)
    }

    const userSignout = () => {
        signOut()
        setOpen(false)
    }

    // Lifecycle
    useEffect(() => {
        setWidth(window.innerWidth)
    })

    useEffect(() => {
        if (searchText.trim()) {
            const debounceFunc = setTimeout(async () => {
                onSearch()
            }, 750)

            return () => clearTimeout(debounceFunc)
        } else {
            setResults(null)
        }
    }, [searchText])

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
                <div className='flex sm:flex-col sm:items-start items-center gap-3 sm:my-6'>
                    {sidebarItems.map((item, index) => item.show && (
                        <SidebarItem
                            key={index}
                            Icon={item.icon}
                            title={item.title}
                            path={item.path}
                            clickFunction={item.onClick}
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

            {isOpen && (
                <Modal>
                    {
                        isOpen === "tweet"
                            ? <TweetBox />
                            : isOpen === "search"
                                ? (
                                    <div className="p-4">
                                        <div className="flex items-center rounded space-x-2 px-4 py-2 bg-zinc-800 text-gray-400">
                                            <SearchIcon className="h-5 w-5" />
                                            <input
                                                type="search"
                                                placeholder="Search username"
                                                className="flex-1 outline-none bg-transparent placeholder:text-gray-400"
                                                onChange={e => setSearchText(e.target.value)}
                                                value={searchText}
                                            />
                                        </div>
                                        {(searchText && results) && (
                                            <div className="bg-zinc-800 flex flex-col gap-y-2 p-2 mt-2 rounded">
                                                {
                                                    results?.length
                                                        ? results.map(result => (
                                                            <Link
                                                                key={result.uid}
                                                                passHref={true}
                                                                onClick={() => {
                                                                    setIsOpen('')
                                                                    setSearchText('')
                                                                }}
                                                                href={"/profile/" + result?.uid}
                                                                className="hover:bg-zinc-700 flex rounded gap-x-2 px-2 py-1"
                                                            >
                                                                <Image
                                                                    className="rounded-full w-auto"
                                                                    src={result?.image}
                                                                    height={42}
                                                                    width={42}
                                                                    alt=""
                                                                />
                                                                <div>
                                                                    <h4 className='font-semibold text-zinc-300'>
                                                                        {result?.name}
                                                                    </h4>
                                                                    <p className='text-gray-400 text-xs'>
                                                                        @{result?.tag}
                                                                    </p>
                                                                </div>
                                                            </Link>
                                                        ))
                                                        : <p className="text-center text-zinc-300">No Result</p>
                                                }
                                            </div>
                                        )}
                                    </div>
                                ) : null
                    }
                </Modal>
            )}

        </aside>
    );
}

export default Sidebar;