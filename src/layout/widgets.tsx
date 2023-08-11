import Link from 'next/link'
import Image from "next/image"
import { useState, useEffect } from "react"
import { SearchIcon } from "@heroicons/react/outline"
import { TwitterTimelineEmbed } from "react-twitter-embed"
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

const Widgets = () => {
    // State
    const [searchText, setSearchText] = useState<string>('')
    const [results, setResults] = useState<Array<any> | null>(null)

    // Search with debounce
    const onSearch = async () => {
        let users: DocumentData[] = []
        const userQuery = query(collection(db, "users"), orderBy('tag'), startAt(searchText.toLowerCase()), endAt(searchText.toLowerCase() + '\uf8ff'))
        const result = await getDocs(userQuery)
        result.forEach((doc) => users.push(doc.data()))
        setResults(users)
    }

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
        <div className="border-l border-zinc-700 space-y-5 px-6 hidden lg:inline col-span-2 overflow-auto">

            <div className="bg-zinc-900 sticky top-0 py-5">
                <div className="flex items-center rounded-full space-x-2 px-4 py-2 bg-zinc-800 text-gray-400">
                    <SearchIcon className="h-5 w-5" />
                    <input
                        type="search"
                        placeholder="Search Twidd"
                        className="flex-1 outline-none bg-transparent placeholder:text-gray-400"
                        onChange={e => setSearchText(e.target.value)}
                        value={searchText}
                    />
                </div>
                {(searchText && results) && (
                    <div className="bg-zinc-800 flex flex-col gap-y-2 p-2 mt-1 rounded">
                        {
                            results?.length
                                ? results.map(result => (
                                    <Link
                                        key={result.uid}
                                        passHref={true}
                                        href={"/profile/" + result?.uid}
                                        className="hover:bg-zinc-700 flex rounded gap-x-2 px-2 py-1"
                                    >
                                        <Image
                                            className="rounded-full"
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

            <TwitterTimelineEmbed
                noHeader
                transparent
                theme="dark"
                sourceType="profile"
                screenName="elonmusk"
            />

        </div>
    );
}

export default Widgets;