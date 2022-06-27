import Image from "next/image"
import { DotsHorizontalIcon, LogoutIcon } from "@heroicons/react/outline"

interface ProfileProps {
    open: boolean
    session: any
    signout: Function
    openMenu: Function
}

const UserInfo = ({ open, openMenu, session, signout }: ProfileProps) => {
    return (
        <div className='relative'>
            <div className={`absolute top-[-4rem] bg-embed w-full h-fit p-2 rounded shadow shadow-zinc-500 transition-all duration-200 opacity-0 ${open && "opacity-100"}`}>
                <button
                    onClick={() => signout()}
                    className='w-full tracking-wide text-zinc-100 hover:bg-gray-700 rounded p-2'
                >
                    <span className="hidden md:inline">
                        Logout <small className='text-gray-300'>@{session?.user?.tag}</small>
                    </span>
                    <LogoutIcon className="w-6 h-6 md:hidden" />
                </button>
            </div>
            <div
                onClick={() => openMenu()}
                className='flex items-center rounded-full cursor-pointer w-fit p-2 mx-auto hover:bg-embed'
            >
                <Image
                    src={session?.user?.image || ""}
                    className='rounded-full'
                    height={42}
                    width={42}
                    alt=""
                />
                <div className='hidden md:inline leading-5 mr-4 ml-2'>
                    <h4 className='font-semibold text-zinc-300'>
                        {session?.user?.name}
                    </h4>
                    <p className='text-gray-400 text-xs'>
                        @{session?.user?.tag}
                    </p>
                </div>
                <DotsHorizontalIcon
                    className='h-5 hidden md:inline text-gray-300'
                />
            </div>
        </div>
    );
}

export default UserInfo;