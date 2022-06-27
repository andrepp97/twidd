import { useEffect, useState } from 'react'
import { RefreshIcon } from '@heroicons/react/outline'
import { getProviders, getSession, useSession } from 'next-auth/react'
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useRecoilValue } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import Post from '../components/post'
import Login from '../components/login'
import Spinner from '../components/spinner'
import TweetBox from '../components/tweetBox'
import Modal from '../components/modal'

export async function getServerSideProps(context: any) {
    const session = await getSession(context)
    const providers = await getProviders()

    return {
        props: {
            providers,
            session,
        },
    }
}

const Home = ({ providers }: any) => {
    // Hooks
    const { data: session } = useSession()
    const isOpen = useRecoilValue(modalState)
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

            {isOpen && <Modal />}

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