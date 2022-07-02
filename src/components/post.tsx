import Image from "next/image"
import Moment from "react-moment"
import Linkify from "linkify-react"
import Zoom from "react-medium-image-zoom"
import { useEffect, useState } from "react"
import { useRouter } from "next/router"
import { useSession } from "next-auth/react"
import { DotsHorizontalIcon } from "@heroicons/react/outline"
import { useRecoilState } from "recoil"
import { modalState, postIdState } from "../atoms/modalAtom"
import { collection, deleteDoc, doc, onSnapshot, orderBy, query, setDoc } from "firebase/firestore"
import { db } from "../lib/firebase"
import PostActions from "./postActions"
import SharePost from "./sharePost"

const linkifyOptions = {
    className: "text-blue-500 hover:underline break-all",
    rel: "noopener noreferrer",
    target: "_blank",
    validate: true,
    truncate: 0,
}

interface PostProps {
    id: string
    postPage: any
    post: {
        id: string,
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
    const router = useRouter()
    const { data: session }: any = useSession()
    const [isOpen, setIsOpen] = useRecoilState(modalState)
    const [postId, setPostId] = useRecoilState(postIdState)
    const [comments, setComments] = useState<Array<any>>([])
    const [likes, setLikes] = useState<Array<any>>([])
    const [liked, setLiked] = useState<boolean>(false)
    const [share, setShare] = useState<boolean>(false)
    const [copied, setCopied] = useState<boolean>(false)

    // Function
    const onClickComment = (e: { stopPropagation: () => void }) => {
        e.stopPropagation()
        setPostId(id)
        setIsOpen("comment")
    }

    const deletePost = (e: { stopPropagation: () => void }) => {
        e.stopPropagation()
        const isDelete = confirm("Delete This Post ?").valueOf()
        if (isDelete) {
            deleteDoc(doc(db, "posts", id))
            router.push("/")
        }
    }

    const likePost = async (e: { stopPropagation: () => void }) => {
        e.stopPropagation()
        if (liked) {
            await deleteDoc(doc(db, "posts", id, "likes", session.user.uid))
        } else {
            await setDoc(doc(db, "posts", id, "likes", session.user.uid), {
                username: session.user.name
            })
        }
    }

    const sharePost = (e: { stopPropagation: () => void }) => {
        e.stopPropagation()
        setShare(prev => !prev)
        setCopied(false)
    }

    const copyToClipboard = () => {
        navigator.clipboard.writeText(`https://twitme.netlify.app/post/${id}`)
        setCopied(true)
    }

    // Lifecycle
    useEffect(() => {
        return onSnapshot(
            query(
                collection(db, "posts", id, "comments"),
                orderBy("timestamp", "desc")
            ),
            (snapshot) => setComments(snapshot.docs)
        )
    }, [db, id])

    useEffect(() => {
        return onSnapshot(collection(db, "posts", id, "likes"), (snapshot => setLikes(snapshot.docs)))
    }, [db, id])

    useEffect(() => {
        return setLiked(likes.findIndex(like => like.id == session?.user?.uid) !== -1)
    }, [likes])

    // Render
    return (
        <div
            onClick={() => !postPage && router.push(`/post/${id}`)}
            className="flex cursor-pointer border-b border-gray-700 hover:bg-neutral-800 p-4"
        >

            {!postPage && post?.userImg && (
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

            <div className="flex flex-col space-y-2 w-full relative">

                <div className={`flex mb-2 ${!postPage && "justify-between"}`}>

                    {postPage && post?.userImg && (
                        <div className="w-fit">
                            <Image
                                className="rounded-full"
                                src={post?.userImg}
                                height={44}
                                width={44}
                                alt=""
                            />
                        </div>
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
                                <small className="text-gray-400 hover:underline">
                                    <Moment fromNow>
                                        {post?.timestamp?.toDate()}
                                    </Moment>
                                </small>
                            </div>
                            <div
                                onClick={(e) => e.stopPropagation()}
                                className="group hidden sm:inline text-gray-300 flex-shrink-0 ml-auto"
                            >
                                <DotsHorizontalIcon className="h-5 group-hover:text-[#1D9BF0]" />
                            </div>
                        </div>

                        {!postPage && (
                            <div className="mt-2">
                                <p className="text-sm md:text-base">
                                    <Linkify options={linkifyOptions}>
                                        {post?.text}
                                    </Linkify>
                                </p>
                                {post?.image && (
                                    <img
                                        className={`rounded-lg object-cover mt-2 w-full ${postPage ? "h-fit" : "max-h-96"}`}
                                        src={post.image}
                                        alt=""
                                    />
                                )}
                            </div>
                        )}
                    </div>

                </div>

                {postPage && (
                    <div className="text-zinc-300 mt-2">
                        <p className="text-sm md:text-base mb-2">
                            <Linkify options={linkifyOptions}>
                                {post?.text}
                            </Linkify>
                        </p>
                        {post?.image && (
                            <Zoom>
                                <img
                                    className={`rounded-lg object-cover w-full ${postPage ? "h-fit" : "max-h-96"}`}
                                    src={post.image}
                                    alt=""
                                />
                            </Zoom>
                        )}
                    </div>
                )}

                <PostActions
                    id={post?.id}
                    session={session}
                    comments={comments}
                    onClickComment={onClickComment}
                    deletePost={deletePost}
                    sharePost={sharePost}
                    likePost={likePost}
                    likes={likes}
                    liked={liked}
                />

                {share && (
                    <div
                        onClick={e => e.stopPropagation()}
                        className="absolute right-0 bottom-10 z-10 bg-zinc-700 bg-opacity-95 rounded-lg max-w-xs space-y-4 p-4"
                    >
                        <SharePost url={`https://twitme.netlify.app/post/${id}`} />
                        <div className="flex items-center gap-1 text-gray-300 w-auto">
                            <p className="overflow-auto text-sm rounded-sm border border-gray-400 p-1">
                                {`https://twitme.netlify.app/post/${id}`}
                            </p>
                            <button
                                onClick={copyToClipboard}
                                className={`${copied ? "bg-zinc-900" : "bg-embed"} rounded-sm px-2 py-1`}
                            >
                                {copied ? "Copied!" : "Copy"}
                            </button>
                        </div>
                    </div>
                )}
            </div>


        </div>
    );
}

export default Post;