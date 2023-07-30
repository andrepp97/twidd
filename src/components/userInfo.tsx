import Image from "next/image"

interface ProfileProps {
    open: boolean
    session: any
    signout: Function
    openMenu: Function
}

const UserInfo = ({ open, openMenu, session, signout }: ProfileProps) => {
    return (
        <div className='relative'>
            <div className={`absolute -top-20 md:-top-[48px] bg-embed w-fit md:w-full h-fit p-1 rounded shadow-md shadow-zinc-500 transition-all duration-200 opacity-0 ${open && "opacity-100"}`}>
                <button
                    onClick={() => signout()}
                    className='w-full tracking-wide text-zinc-100 hover:bg-gray-700 rounded p-1'
                >
                    Logout <small className='text-gray-300'>@{session?.user?.tag}</small>
                </button>
            </div>
            <div
                onClick={() => openMenu()}
                className='flex items-center rounded-full cursor-pointer sm:p-2 mx-auto hover:bg-embed'
            >
                <Image
                    src={session?.user?.image || ""}
                    className='rounded-full'
                    height={40}
                    width={40}
                    alt=""
                />
                <div className='hidden md:inline leading-5 mx-2'>
                    <h4 className='font-semibold text-zinc-300'>
                        {session?.user?.name}
                    </h4>
                    <p className='text-gray-400 text-xs'>
                        @{session?.user?.tag}
                    </p>
                </div>
            </div>
        </div>
    );
}

export default UserInfo;