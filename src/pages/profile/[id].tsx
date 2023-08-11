import Head from 'next/head'
import Image from 'next/image'
import Moment from "react-moment"
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { getProviders, useSession } from 'next-auth/react'
import { CalendarIcon } from '@heroicons/react/outline'
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
    const router = useRouter()
    const { id }: any = router.query
    const { data: session }: any = useSession()
    const [data, setData] = useState<any>()
    const [userPosts, setUserPosts] = useState<Array<{ id: string, data: any }> | null>(null)

    // Function
    const getUserProfile = async () => {
        let users: DocumentData[] = []
        let posts: Array<{ id: string, data: any }> = []

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
    }

    // Lifecycle
    useEffect(() => {
        window.scrollTo(0, 0)
    }, [])

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
            <div className='pb-80'>
                <Head>
                    <title>
                        {data?.name} (@{data?.tag})
                    </title>
                </Head>
                <div className="h-48 w-full bg-zinc-700" />
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