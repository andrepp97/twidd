import { useEffect, useRef, useState } from 'react'
import { RefreshIcon } from '@heroicons/react/outline'
import { getProviders, getSession, useSession } from 'next-auth/react'
import {
    collection,
    onSnapshot,
    orderBy,
    query,
    addDoc,
    getDocs,
    where,
    serverTimestamp,
    DocumentData,
} from 'firebase/firestore'
import { db } from '../lib/firebase'
import { useRecoilValue } from 'recoil'
import { modalState } from '../atoms/modalAtom'
import Post from '../components/post'
import Login from '../components/login'
import Spinner from '../components/spinner'
import CommentBox from '../components/commentBox'
import TweetBox from '../components/tweetBox'
import Modal from '../components/modal'

interface User {
    uid: number;
    name: string;
    tag: string;
    email: string;
    image: string;
    timestamp?: string;
}

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
    const homeRef = useRef<any>()
    const { data: session } = useSession()
    const isOpen = useRecoilValue(modalState)
    const [refresh, setRefresh] = useState(false)
    const [posts, setPosts] = useState<Array<{ id: string, data: any }> | null>(null)

    // Function
    const getPosts = () => {
        onSnapshot(query(collection(db, "posts"), orderBy("timestamp", "desc")), (snapshot: any) => setPosts(snapshot.docs))
    }

    const insertUser = async () => {
        try {
            const userTemp: User | any = session?.user
            const { uid } = userTemp
            const q = query(collection(db, "users"), where("uid", "==", uid))
            const result = await getDocs(q)
            let users: { id: string; data: DocumentData }[] = []
            result.forEach((doc) => {
                users.push({
                    id: doc.id,
                    data: doc.data(),
                })
            })
            if (!users.length) addDoc(collection(db, "users"), { ...session?.user, timestamp: serverTimestamp() })
        } catch (error) {
            console.log('masuk catch')
        }
    }

    const executeScroll = () => {
        if (!refresh) {
            try {
                homeRef.current.scrollIntoView({ behavior: "smooth" })
                setRefresh(true)
                getPosts()
            } catch (error) {
                console.log(error)
            } finally {
                setTimeout(() => {
                    setRefresh(false)
                }, 1000)
            }
        }
    }

    // Lifecycle
    useEffect(() => {
        return getPosts()
    }, [db])

    useEffect(() => {
        if (session) insertUser()
    }, [session])

    // Render
    if (!session) return <Login providers={providers} />
    return (
        <div ref={homeRef} className='pb-72'>
            <div className='text-zinc-100 bg-zinc-900 bg-opacity-95 flex items-center justify-between sticky top-0 px-4 py-2 sm:py-4 z-10'>
                <h1 className='text-xl font-semibold'>
                    Home
                </h1>
                <button
                    onClick={executeScroll}
                    className='rounded-full hover:bg-embed p-1 group disabled:opacity-50'
                >
                    <RefreshIcon
                        className='w-5 h-5 cursor-pointer transition-all duration-300 ease-out group-hover:rotate-180 group-hover:text-zinc-100 group-active:scale-125'
                    />
                </button>
            </div>

            <div className='hidden sm:inline'>
                <TweetBox />
            </div>

            {isOpen === "comment" && (
                <Modal>
                    <CommentBox />
                </Modal>
            )}

            {refresh && <div className='py-4'><Spinner /></div>}

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
                    : <div className='py-4'><Spinner /></div>
            }
        </div>
    )
}

export default Home