import { useEffect, useState } from 'react'
import { getProviders, getSession, useSession } from 'next-auth/react'
import { RefreshIcon } from '@heroicons/react/outline'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'
import Post from '../components/post'
import Login from '../components/login'
import Spinner from '../components/spinner'
import TweetBox from '../components/tweetBox'

export async function getServerSideProps(context: any) {
    const trendingResults = await fetch("https://jsonkeeper.com/b/NKEV")
        .then(res => res.json())
    const followResults = await fetch("https://jsonkeeper.com/b/WWMJ")
        .then(res => res.json())
    const session = await getSession(context)
    const providers = await getProviders()

    return {
        props: {
            trendingResults,
            followResults,
            providers,
            session,
        },
    }
}

interface HomeProps {
    trendingResults: ArrayLike<string>
    followResults: ArrayLike<string>
    providers: {}
}

const Home = ({ trendingResults, followResults, providers }: HomeProps) => {
    // Hooks
    const { data: session } = useSession()
    const [posts, setPosts] = useState<Array<{ id: string, data: any }> | null>(null)

    // Lifecycle
    useEffect(() => {
        return onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snapshopt: any) => setPosts(snapshopt.docs))
    }, [db])

    // Render
    if (!session) return <Login providers={providers} />
    return (
        <div>

            <div className='text-zinc-100 flex items-center justify-between overflow-auto my-3 px-4'>
                <h1 className='text-xl font-semibold'>
                    Home
                </h1>
                <button className='rounded-full hover:bg-embed p-1 group'>
                    <RefreshIcon
                        className='w-5 h-5 cursor-pointer transition-all duration-300 ease-out group-hover:rotate-180 group-hover:text-zinc-100 group-active:scale-125'
                    />
                </button>
            </div>

            <TweetBox />

            {
                posts
                    ? posts.map(post => (
                        <Post
                            id={post.id}
                            key={post.id}
                            post={post.data()}
                            postPage={undefined}
                        />
                    ))
                    : <Spinner />
            }

        </div>
    )
}

export default Home