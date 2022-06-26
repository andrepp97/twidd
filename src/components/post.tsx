import Image from "next/image"
import { useSession } from "next-auth/react"
import {
    DotsHorizontalIcon,
    ChatIcon,
    ShareIcon,
    TrashIcon,
    SwitchHorizontalIcon,
    HeartIcon as HeartOutlineIcon,
} from "@heroicons/react/outline"
import { HeartIcon as HeartSolidICon } from "@heroicons/react/solid"

interface PostProps {
    id: string
    postPage: any
    post: {
        username: string,
        userImg: string,
        image: string,
        text: string,
        tag: string,
        timestamp: any,
    }
}

const Post = ({ id, post, postPage }: PostProps) => {
    // Hooks
    const { data: session } = useSession()

    // Render
    return (
        <div className="flex cursor-pointer border-b border-gray-700 hover:bg-neutral-800 p-4">

            {!postPage && (
                <div className="min-w-fit">
                    <Image
                        className="rounded-full"
                        src={post?.userImg}
                        height={44}
                        width={44}
                        alt=""
                    />
                </div>
            )}

            <div className="flex flex-col space-y-2 w-full">

                <div className={`flex ${!postPage && "justify-between"}`}>

                    {postPage && (
                        <Image
                            className="rounded-full"
                            src={post?.userImg}
                            height={44}
                            width={44}
                            alt=""
                        />
                    )}

                    <div className="text-zinc-300 w-full ml-2">

                        <div className="w-full flex items-center justify-between">
                            <div className="inline-block group">
                                <p className={`text-[14px] lg:text-sm font-semibold group-hover:underline ${!postPage && "inline-block"}`}>
                                    {post?.username}
                                </p>
                                <small className={`text-gray-400 text-xs ${!postPage && "ml-1"}`}>
                                    @{post?.tag}
                                </small>
                                <span className="text-gray-300 mx-1">·</span>
                                <small className="hover:underline">
                                    {/* <Moment fromNow> */}
                                    {/* {post?.timestamp?.toDate()} */}
                                    {/* </Moment> */}
                                </small>
                            </div>
                            <div className="group hidden sm:inline text-gray-300 flex-shrink-0 ml-auto">
                                <DotsHorizontalIcon className="h-5 group-hover:text-[#1D9BF0]" />
                            </div>
                        </div>

                        <p className="text-sm md:text-base mt-1">
                            {post?.text}
                        </p>

                        {post.image && (
                            <img
                                className="rounded-lg object-cover w-full max-h-96 my-2"
                                src={post.image}
                                alt=""
                            />
                        )}

                    </div>

                </div>

                <div className="flex items-center justify-between w-full sm:w-8/12 text-gray-400">
                    <div className="group iconButton">
                        <ChatIcon className="icon" />
                    </div>
                    <div className="group iconButton">
                        <SwitchHorizontalIcon className="icon" />
                    </div>
                    <div className="group iconButton">
                        <HeartOutlineIcon className="icon" />
                    </div>
                    <div className="group iconButton">
                        <ShareIcon className="icon" />
                    </div>
                </div>

            </div>

        </div>
    );
}

export default Post;