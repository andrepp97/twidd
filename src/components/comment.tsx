import Link from "next/link"
import Image from "next/image"
import Moment from "react-moment"

const Comment = ({ comment }: any) => {
    return (
        <div className="flex border-b border-gray-700 space-x-4 p-4">
            <div className="w-fit">
                <Link
                    passHref={true}
                    href={"/profile/" + comment?.userId}
                >
                    <Image
                        className="rounded-full"
                        src={comment?.userImg}
                        height={44}
                        width={44}
                        alt=""
                    />
                </Link>
            </div>
            <div className="flex flex-col space-y-2 w-full">
                <div className="flex justify-between">
                    <Link
                        passHref={true}
                        href={"/profile/" + comment?.userId}
                        className="text-[#6e767d]"
                    >
                        <p className="font-semibold text-[#d9d9d9] text-[14px] lg:text-sm inline-block hover:underline">
                            {comment?.username}
                        </p>
                        <div className="leading-4">
                            <span className="text-gray-400 text-xs">
                                @{comment?.tag}
                            </span>
                            <span className="text-gray-300 mx-1">·</span>
                            <small className="text-gray-400 hover:underline">
                                <Moment fromNow>
                                    {comment?.timestamp?.toDate()}
                                </Moment>
                            </small>
                        </div>
                        <p className="text-[#d9d9d9] mt-2 max-w-lg overflow-scroll text-[15px] sm:text-base">
                            {comment?.comment}
                        </p>
                    </Link>
                </div>
            </div>
        </div>
    );
}

export default Comment;