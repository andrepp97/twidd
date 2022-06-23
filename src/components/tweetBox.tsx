import Image from 'next/image'
import User from '../../public/user.png'
import {
    PhotographIcon,
    EmojiHappyIcon,
    CalendarIcon,
} from '@heroicons/react/outline'
import { useState } from 'react'

const TweetBox = () => {
    // State
    const [tweet, setTweet] = useState<string>("")

    // Render
    return (
        <div className="flex space-x-4 p-4">

            <div className="w-fit">
                <Image
                    className="rounded-full"
                    objectFit="contain"
                    height={60}
                    width={60}
                    src={User}
                    alt="user"
                />
            </div>

            <div className="flex flex-1 items-center">
                <div className="flex flex-1 flex-col">
                    <textarea
                        rows={3}
                        value={tweet}
                        onChange={e => setTweet(e.target.value)}
                        className="text-zinc-100 outline-none rounded-md border-zinc-700 border bg-transparent p-2"
                        placeholder="What's Happening ?"
                    />
                    <div className="flex items-center mt-2">
                        <div className="flex flex-1 space-x-2 text-gray-300">
                            <PhotographIcon className="h-5 w-5 cursor-pointer hover:text-zinc-100" />
                            <EmojiHappyIcon className="h-5 w-5 cursor-pointer hover:text-zinc-100" />
                            <CalendarIcon className="h-5 w-5 cursor-pointer hover:text-zinc-100" />
                        </div>
                        <button
                            disabled={!tweet}
                            className="rounded-full font-semibold text-gray-300 bg-embed hover:bg-zinc-700 active:bg-embed transition-all duration-150 disabled:opacity-50 disabled:hover:bg-embed px-4 py-2"
                        >
                            Tweet
                        </button>
                    </div>
                </div>
            </div>

        </div>
    );
}

export default TweetBox;