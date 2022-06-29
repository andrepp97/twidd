import Image from "next/image"
import Moment from "react-moment"
import { useRouter } from "next/router"
import { useRecoilState, useRecoilValue } from "recoil"
import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { EmojiHappyIcon } from "@heroicons/react/outline"
import { Picker } from "emoji-mart"
import {
    doc,
    addDoc,
    collection,
    onSnapshot,
    serverTimestamp,
} from "@firebase/firestore"
import { db } from "../lib/firebase"
import { modalState, postIdState } from "../atoms/modalAtom"
import Spinner from "./spinner"

const CommentBox = () => {
    // Hooks
    const router = useRouter()
    const { data: session }: any = useSession()
    const postId = useRecoilValue(postIdState)
    const [isOpen, setIsOpen] = useRecoilState(modalState)
    const [post, setPost] = useState<any>()
    const [comment, setComment] = useState<string>("")
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmoji, setShowEmoji] = useState<boolean>(false)

    // Lifecycle
    useEffect(() => {
        return onSnapshot(doc(db, "posts", postId), (snapshot) => setPost(snapshot.data()))
    }, [db])

    // Function
    const onEmojiClick = (e: any) => {
        let symbol = e.unified.split("-")
        let codesArray: any[] = []
        symbol.forEach((char: string) => codesArray.push("0x" + char))
        let emoji = String.fromCodePoint(...codesArray)
        setComment(comment + emoji)
    }

    const sendComment = async (e: { preventDefault: () => void }) => {
        e.preventDefault()

        try {
            setLoading(true)
            await addDoc(collection(db, "posts", postId, "comments"), {
                comment: comment,
                tag: session.user.tag,
                userId: session.user.uid,
                userImg: session.user.image,
                username: session.user.name,
                timestamp: serverTimestamp(),
            })
        } catch (error) {
            console.log(error)
        } finally {
            setIsOpen("")
            setComment("")
            setLoading(false)
            router.push(`/post/${postId}`)
        }
    }

    // Render
    return (
        <div className="flex px-4 pt-5 pb-2.5 sm:px-6">
            <div className="w-full">

                <div className="text-[#6e767d] flex gap-x-3 relative">
                    <span className="w-0.5 h-full z-[-1] absolute left-5 top-11 bg-gray-600" />
                    {post && (
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
                    <div>
                        <div className="inline-block group">
                            <h4 className="font-bold text-[#d9d9d9] inline-block text-[15px] sm:text-base">
                                {post?.username}
                            </h4>
                            <span className="ml-1.5 text-sm sm:text-[15px]">
                                @{post?.tag}{" "}
                            </span>
                        </div>{" "}
                        ·{" "}
                        <span className="hover:underline text-sm sm:text-[15px]">
                            <Moment fromNow>{post?.timestamp?.toDate()}</Moment>
                        </span>
                        <p className="text-[#d9d9d9] text-[15px] sm:text-base">
                            {post?.text}
                        </p>
                    </div>
                </div>

                <div className="mt-7 flex space-x-3 w-full">
                    {session && (
                        <div className="min-w-fit">
                            <Image
                                alt=""
                                width={44}
                                height={44}
                                className="rounded-full"
                                src={session?.user?.image}
                            />
                        </div>
                    )}
                    <div className="flex-grow mt-2">
                        <textarea
                            rows={2}
                            value={comment}
                            onChange={(e) => setComment(e.target.value)}
                            disabled={loading}
                            placeholder="Tweet your reply"
                            className="bg-transparent outline-none border border-zinc-700 rounded-lg text-[#d9d9d9] tracking-wide w-full min-h-[80px] p-2"
                        />

                        {
                            loading
                                ? <div className="flex py-2"><Spinner /></div>
                                : (
                                    <div className="flex items-center justify-between py-2">
                                        <div className="relative flex items-center space-x-2 text-gray-300">
                                            <div
                                                className="hidden sm:inline"
                                                onClick={() => setShowEmoji(prev => !prev)}
                                            >
                                                <EmojiHappyIcon
                                                    className="h-5 w-5 cursor-pointer hover:text-zinc-100"
                                                />
                                            </div>
                                            {showEmoji && (
                                                <Picker
                                                    theme="dark"
                                                    onSelect={onEmojiClick}
                                                    style={{
                                                        position: "absolute",
                                                        zIndex: 2,
                                                        top: 0,
                                                        left: "1rem",
                                                        maxWidth: "270px",
                                                        borderRadius: "1rem",
                                                    }}
                                                />
                                            )}
                                        </div>
                                        <button
                                            className="bg-[#1d9bf0] text-white rounded-full px-4 py-1.5 font-bold shadow-md hover:bg-[#1a8cd8] disabled:hover:bg-[#1d9bf0] disabled:opacity-50 disabled:cursor-default"
                                            disabled={!comment.trim()}
                                            onClick={sendComment}
                                        >
                                            Reply
                                        </button>
                                    </div>
                                )
                        }
                    </div>
                </div>

            </div>
        </div>
    );
}

export default CommentBox;