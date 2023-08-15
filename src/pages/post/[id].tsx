import Head from 'next/head'
import { useRouter } from 'next/router'
import { useRecoilValue } from 'recoil'
import { useEffect, useState } from 'react'
import { getProviders, useSession } from 'next-auth/react'
import { ArrowLeftIcon } from '@heroicons/react/outline'
import {
    doc,
    query,
    onSnapshot,
    collection,
    orderBy,
} from "@firebase/firestore"
import { db } from '../../lib/firebase'
import Login from '../../components/login'
import Spinner from '../../components/spinner'
import Modal from '../../components/modal'
import Post from '../../components/post'
import Comment from '../../components/comment'
import CommentBox from '../../components/commentBox'
import { modalState } from '../../atoms/modalAtom'

export async function getServerSideProps() {
    const providers = await getProviders()

    return {
        props: { providers }
    }
}

const PostPage = ({ providers }: any) => {
    // Hooks
    const router = useRouter()
    const { id }: any = router.query
    const { data: session }: any = useSession()
    const isOpen = useRecoilValue(modalState)
    const [post, setPost] = useState<any>()
    const [comments, setComments] = useState<Array<any>>([])

    // Lifecycle
    useEffect(() => {
        return onSnapshot(doc(db, "posts", id), (snapshot) => setPost(snapshot.data()))
    }, [])

    useEffect(() => {
        return onSnapshot(
            query(collection(db, "posts", id, "comments"), orderBy("timestamp", "desc")),
            (snapshot) => setComments(snapshot.docs)
        )
    }, [db, id])

    // Render
    if (session === undefined) return (
        <div className='w-scren h-screen flex items-center justify-center'>
            <Spinner />
        </div>
    )

    return !session
        ? <Login providers={providers} />
        : (
            <div className="pb-72">

                <Head>
                    <title>
                        {post?.username} on Twidd: "{post?.text}"
                    </title>
                </Head>

                <div className="flex-grow">
                    <div className="flex items-center p-2 border-b border-gray-700 bg-zinc-900 text-zinc-100 font-semibold text-xl gap-x-4 sticky top-0 z-10">
                        <div
                            onClick={() => router.back()}
                            className="flex items-center justify-center hover:bg-gray-700 cursor-pointer rounded-full p-1"
                        >
                            <ArrowLeftIcon className="h-5 w-5 text-white" />
                        </div>
                        Post
                    </div>

                    <Post
                        id={id}
                        post={post}
                        postPage
                    />

                    {comments.length > 0 && (
                        <div>
                            <p className="text-zinc-300 font-semibold border-gray-700 border-b p-4">
                                Replies
                            </p>
                            {comments.map((comment) => (
                                <Comment
                                    id={comment.id}
                                    key={comment.id}
                                    comment={comment.data()}
                                />
                            ))}
                        </div>
                    )}
                </div>

                {isOpen === "comment" && (
                    <Modal>
                        <CommentBox />
                    </Modal>
                )}

            </div >
        );
}

export default PostPage;