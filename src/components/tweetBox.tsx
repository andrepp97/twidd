import Image from 'next/image'
import { useRouter } from 'next/router'
import { useRef, useState } from 'react'
import { useSession } from 'next-auth/react'
import {
    PhotographIcon,
    EmojiHappyIcon,
    CalendarIcon,
    XIcon,
} from '@heroicons/react/outline'
import {
    doc,
    addDoc,
    updateDoc,
    collection,
    serverTimestamp,
} from "@firebase/firestore"
import {
    ref,
    uploadString,
    getDownloadURL,
} from "@firebase/storage"
import Spinner from './spinner'
import { db, storage } from "../lib/firebase"
import { Picker } from "emoji-mart"
import { useRecoilState } from 'recoil'
import { modalState } from '../atoms/modalAtom'

const TweetBox = () => {
    // Hooks
    const router = useRouter()
    const { data: session }: any = useSession()
    const filePickerRef = useRef<HTMLInputElement>(null)
    const [isOpen, setIsOpen] = useRecoilState(modalState)
    const [tweet, setTweet] = useState<string>("")
    const [image, setImage] = useState<any>(null)
    const [loading, setLoading] = useState<boolean>(false)
    const [showEmoji, setShowEmoji] = useState<boolean>(false)

    // Function
    const pickImage = () => filePickerRef.current && filePickerRef.current.click()

    const addImage = (e: { target: { files: any } }) => {
        const reader = new FileReader()
        if (e.target.files[0]) reader.readAsDataURL(e.target.files[0])
        reader.onload = (readerEvent) => setImage(readerEvent.target?.result)
    }

    const onEmojiClick = (e: any) => {
        let symbol = e.unified.split("-")
        let codesArray: any[] = []
        symbol.forEach((char: string) => codesArray.push("0x" + char))
        let emoji = String.fromCodePoint(...codesArray)
        setTweet(tweet + emoji)
    }

    const sendTweet = async () => {
        try {
            setLoading(true)

            const docRef = await addDoc(collection(db, "posts"), {
                id: session.user.uid,
                username: session.user.name,
                userImg: session.user.image,
                tag: session.user.tag,
                text: tweet,
                timestamp: serverTimestamp(),
            })

            const imageRef = ref(storage, `posts/${docRef.id}/image`)

            if (image) {
                await uploadString(imageRef, image, "data_url")
                    .then(async () => {
                        const downloadURL = await getDownloadURL(imageRef)
                        await updateDoc(doc(db, "posts", docRef.id), { image: downloadURL })
                    })
                    .catch(err => console.log(err))
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
            setShowEmoji(false)
            setImage(null)
            setTweet("")
            setIsOpen("")
            router.push("/")
        }
    }

    // Render
    return (
        <div className={`flex border-b border-gray-700 space-x-2 p-4 ${loading && "opacity-75"}`}>

            <div className="w-fit">
                <Image
                    src={session.user.image}
                    className="rounded-full"
                    objectFit="contain"
                    height={48}
                    width={48}
                    alt="You"
                />
            </div>

            <div className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col space-y-2">
                    <textarea
                        rows={3}
                        value={tweet}
                        onChange={e => setTweet(e.target.value)}
                        disabled={loading}
                        placeholder="What's Happening ?"
                        className="text-zinc-100 outline-none rounded-lg border-zinc-700 border bg-transparent tracking-wide min-h-[48px] p-2"
                    />

                    {image && (
                        <div className="relative">
                            <div
                                className="absolute w-8 h-8 bg-[#15181c] hover:bg-gray-700 bg-opacity-90 rounded-full flex items-center justify-center top-1 left-1 cursor-pointer"
                                onClick={() => setImage(null)}
                            >
                                <XIcon className="text-white h-5" />
                            </div>
                            <img
                                alt=""
                                src={image}
                                className="rounded-lg object-contain max-h-96"
                            />
                        </div>
                    )}

                    {
                        loading
                            ? <Spinner />
                            : (
                                <div className="flex items-center">
                                    <div className="flex flex-1 space-x-3 text-gray-300">
                                        <div onClick={pickImage}>
                                            <PhotographIcon className="h-5 w-5 cursor-pointer hover:text-zinc-100" />
                                            <input
                                                hidden
                                                type="file"
                                                accept="image/*"
                                                ref={filePickerRef}
                                                onChange={addImage}
                                            />
                                        </div>
                                        <div onClick={() => setShowEmoji(prev => !prev)}>
                                            <EmojiHappyIcon
                                                className="h-5 w-5 cursor-pointer hover:text-zinc-100"
                                            />
                                        </div>
                                        <CalendarIcon className="h-5 w-5 cursor-pointer hover:text-zinc-100" />
                                        {showEmoji && (
                                            <Picker
                                                theme="dark"
                                                onSelect={onEmojiClick}
                                                style={{
                                                    position: "absolute",
                                                    marginLeft: "-3rem",
                                                    marginTop: "2rem",
                                                    maxWidth: "270px",
                                                    zIndex: 2,
                                                    borderRadius: "1rem",
                                                }}
                                            />
                                        )}
                                    </div>
                                    <button
                                        onClick={sendTweet}
                                        disabled={!tweet.trim()}
                                        className="rounded-full font-semibold text-gray-300 bg-[#1D9BF0] hover:bg-[#1A8CD8] transition-all duration-150 disabled:opacity-50 px-4 py-2"
                                    >
                                        Tweet
                                    </button>
                                </div>
                            )
                    }
                </div>
            </div>

        </div>
    );
}

export default TweetBox;