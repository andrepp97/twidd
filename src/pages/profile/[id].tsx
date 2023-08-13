import Head from 'next/head'
import Image from 'next/image'
import Moment from "react-moment"
import { useRouter } from 'next/router'
import { useEffect, useState, useRef } from 'react'
import { getProviders, useSession } from 'next-auth/react'
import { CalendarIcon, ArrowLeftIcon } from '@heroicons/react/outline'
import {
    query,
    getDocs,
    where,
    collection,
    DocumentData,
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
    const [userPosts, setUserPosts] = useState<Array<{ id: string, data: any }> | null>(null)

    // Function
    const getUserProfile = async () => {
        let users: DocumentData[] = []
        let posts: Array<{ id: string, data: any }> = []

        try {
            const userQuery = query(collection(db, "users"), where("uid", "==", id))
            const postsQuery = query(collection(db, "posts"), where("id", "==", id))
            const result = await getDocs(userQuery)
            const postsResult = await getDocs(postsQuery)
            result.forEach((doc) => users.push(doc.data()))
            postsResult.forEach((doc) => posts.push({
                id: doc.id,
                data: doc.data(),
            }))

            setData(users[0])
            setUserPosts(posts)
        } catch (error) {
            console.log(error)
        } finally {
            setTimeout(() => {
                profileRef?.current?.scrollIntoView({ behavior: "smooth" })
            }, 250);
        }
    }

    // Lifecycle
    useEffect(() => {
        if (id) getUserProfile()
    }, [id])

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
                    <p className="text-zinc-200 font-semibold border-[#1D9BF0] border-b-2 w-fit m-4 p-1">
                        Posts
                    </p>
                    {
                        userPosts
                            ? userPosts.length
                                ? userPosts.map(post => (
                                    <Post
                                        id={post.id}
                                        key={post.id}
                                        post={post.data}
                                        postPage={undefined}
                                    />
                                ))
                                : <p className="text-zinc-300 px-4">No posts yet</p>
                            : <div className="py-4"><Spinner /></div>
                    }
                </div>
            </div>
        );
}

export default Profile;