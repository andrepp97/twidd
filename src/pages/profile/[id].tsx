import Head from 'next/head'
import Image from 'next/image'
import Moment from "react-moment"
import { useRouter } from 'next/router'
import { useEffect, useState, useRef, useCallback } from 'react'
import { getProviders, useSession } from 'next-auth/react'
import { CalendarIcon, ArrowLeftIcon } from '@heroicons/react/outline'
import {
    query,
    getDocs,
    where,
    orderBy,
    collection,
    DocumentData,
    collectionGroup,
    documentId,
} from "@firebase/firestore"
import { db } from '../../lib/firebase'
import Post from '../../components/post'
import Login from '../../components/login'
import Spinner from '../../components/spinner'

export async function getServerSideProps() {
    const providers = await getProviders()

    return {
        props: { providers }
    }
}

const Profile = ({ providers }: any) => {
    // Hooks
    const profileRef = useRef<any>()
    const router = useRouter()
    const { id }: any = router.query
    const { data: session }: any = useSession()
    const [data, setData] = useState<any>()
    const [selected, setSelected] = useState<string>('post')
    const [userPosts, setUserPosts] = useState<Array<{ id: string, data: any }> | null>(null)
    const [userReposts, setUserReposts] = useState<Array<{ id: string, data: any }>>([])

    // Function
    const getUserProfile = useCallback(async () => {
        let users: DocumentData[] = []
        let posts: Array<{ id: string, data: any }> = []

        try {
            const userQuery = query(collection(db, "users"), where("uid", "==", id))
            const postsQuery = query(collection(db, "posts"), where("id", "==", id), orderBy("timestamp", "desc"))
            const result = await getDocs(userQuery)
            const postsResult = await getDocs(postsQuery)
            result.forEach((doc) => users.push(doc.data()))
            setData(users[0])

            postsResult.forEach((doc) => posts.push({
                id: doc.id,
                data: doc.data(),
            }))
            setUserPosts(posts)
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
                profileRef?.current?.scrollIntoView({ behavior: "smooth" })
            }, 300);
        }
    }, [id])

    const getUserReposts = useCallback(async () => {
        let repostIds: Array<string> = []
        let reposts: Array<{ id: string, data: any }> = []

        try {
            const repostQuery = query(collectionGroup(db, "reposts"), where("id", "==", id))
            const res = await getDocs(repostQuery)
            res.forEach((doc) => repostIds.push(doc.ref.path.split('/')[1]))
            const q = query(collection(db, "posts"), where(documentId(), "in", repostIds))
            const repostsRes = await getDocs(q)
            repostsRes.forEach((doc) => reposts.push({
                id: doc.id,
                data: doc.data(),
            }))
            setUserReposts(reposts)
        } catch (error) {
            console.log(error)
            setUserReposts([])
        }
    }, [id])

    // Lifecycle
    useEffect(() => {
        if (id) {
            setSelected('post')
            getUserProfile()
            getUserReposts()
        }
    }, [id, getUserProfile, getUserReposts])

    // Render
    if (session === undefined || !data) return (
        <div className='w-scren h-screen flex items-center justify-center'>
            <Spinner />
        </div>
    )

    return !session
        ? <Login providers={providers} />
        : (
            <div ref={profileRef} className='pb-80'>
                <Head>
                    <title>
                        {data?.name} (@{data?.tag})
                    </title>
                </Head>
                <div className="flex items-center p-2 border-b border-gray-700 bg-zinc-900 text-zinc-100 font-semibold text-xl gap-x-4 sticky top-0 z-10">
                    <div
                        onClick={() => router.back()}
                        className="flex items-center justify-center hover:bg-gray-700 cursor-pointer rounded-full p-1"
                    >
                        <ArrowLeftIcon className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <p className='font-semibold text-zinc-200 text-base'>
                            {data?.name}
                        </p>
                        <p className='text-gray-400 text-sm'>
                            {userPosts?.length} posts
                        </p>
                    </div>
                </div>
                <div className="h-44 w-full bg-zinc-700" />
                <div className='leading-5 p-4'>
                    <Image
                        alt=""
                        width={140}
                        height={140}
                        src={data?.image}
                        className='rounded-full border-zinc-900 border-4 -mt-20 mb-4'
                    />
                    <h4 className='font-semibold text-zinc-200 text-xl'>
                        {data?.name}
                    </h4>
                    <p className='text-gray-400 text-sm'>
                        @{data?.tag}
                    </p>
                    <div className='flex items-center gap-2 mt-3'>
                        <CalendarIcon className="h-5 w-5 text-gray-400" />
                        <p className='text-gray-400 text-sm'>
                            Joined&nbsp;
                            <Moment format="MMM YYYY">
                                {data?.timestamp?.toDate()}
                            </Moment>
                        </p>
                    </div>
                </div>
                <div>
                    <div className="flex">
                        <p
                            onClick={() => setSelected('post')}
                            className={`cursor-pointer text-zinc-200 font-semibold w-fit m-4 p-1 ${selected === 'post' && 'border-[#1D9BF0] border-b-2'}`}>
                            Posts
                        </p>
                        <p
                            onClick={() => setSelected('repost')}
                            className={`cursor-pointer text-zinc-200 font-semibold w-fit m-4 p-1 ${selected === 'repost' && 'border-[#1D9BF0] border-b-2'}`}>
                            Reposts
                        </p>
                    </div>
                    {selected === 'post' && (
                        userPosts
                            ? userPosts.length
                                ? userPosts.map(post => (
                                    <Post
                                        id={post.id}
                                        key={post.id}
                                        post={post.data}
                                        postPage={undefined}
                                        repost={undefined}
                                    />
                                ))
                                : <p className="text-zinc-300 px-4">No posts yet</p>
                            : <div className="py-4"><Spinner /></div>
                    )}
                    {selected === 'repost' && (
                        userReposts.length
                            ? userReposts.map(repost => (
                                <Post
                                    id={repost.id}
                                    key={repost.id}
                                    post={repost.data}
                                    postPage={undefined}
                                    repost={{
                                        id: data.uid,
                                        name: data.name,
                                    }}
                                />
                            ))
                            : <p className="text-zinc-300 px-4">No reposts yet</p>
                    )}
                </div>
            </div>
        );
}

export default Profile;