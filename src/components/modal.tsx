import Image from "next/image"
import Moment from "react-moment"
import { useRouter } from "next/router"
import { useRecoilState, useRecoilValue } from "recoil"
import { Fragment, useEffect, useState } from "react"
import { Dialog, Transition } from "@headlessui/react"
import { Picker } from "emoji-mart"
import {
    doc,
    addDoc,
    collection,
    onSnapshot,
    serverTimestamp,
} from "@firebase/firestore"
import { db } from "../lib/firebase"
import { useSession } from "next-auth/react"
import { XIcon, EmojiHappyIcon } from "@heroicons/react/outline"
import { modalState, postIdState } from "../atoms/modalAtom"

const Modal = () => {
    // Hooks
    const router = useRouter()
    const { data: session }: any = useSession()
    const postId = useRecoilValue(postIdState)
    const [isOpen, setIsOpen] = useRecoilState(modalState)
    const [comment, setComment] = useState<string>("")
    const [post, setPost] = useState<any>()
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

        await addDoc(collection(db, "posts", postId, "comments"), {
            comment: comment,
            tag: session.user.tag,
            userImg: session.user.image,
            username: session.user.name,
            timestamp: serverTimestamp(),
        })

        setIsOpen(false)
        setComment("")

        router.push(`/${postId}`)
    }

    // Render
    return (
        <Transition.Root show={isOpen} as={Fragment}>
            <Dialog
                as="div"
                onClose={setIsOpen}
                className="fixed z-50 inset-0 pt-8"
            >
                <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >

                        <div className="bg-zinc-900 inline-block align-bottom rounded-2xl text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl sm:w-full">

                            <div className="flex items-center p-2 border-b border-gray-700">
                                <div
                                    onClick={() => setIsOpen(false)}
                                    className="flex items-center justify-center cursor-pointer group"
                                >
                                    <XIcon className="w-8 h-8 rounded-full text-white group-hover:bg-gray-700 p-1" />
                                </div>
                            </div>

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
                                                placeholder="Tweet your reply"
                                                className="bg-transparent outline-none border border-zinc-700 rounded-lg text-[#d9d9d9] tracking-wide w-full min-h-[80px] p-2"
                                            />

                                            <div className="flex items-center justify-between py-2">
                                                <div className="relative flex items-center space-x-2 text-gray-300">
                                                    <div onClick={() => setShowEmoji(prev => !prev)}>
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
                                                    type="submit"
                                                >
                                                    Reply
                                                </button>
                                            </div>
                                        </div>
                                    </div>

                                </div>
                            </div>

                        </div>

                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default Modal;