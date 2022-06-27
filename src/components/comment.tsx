import Image from "next/image"
import Moment from "react-moment"

const Comment = ({ comment }: any) => {
    return (
        <div className="flex cursor-pointer border-b border-gray-700 space-x-4 p-4">
            <div className="w-fit">
                <Image
                    className="rounded-full"
                    src={comment?.userImg}
                    height={44}
                    width={44}
                    alt=""
                />
            </div>
            <div className="flex flex-col space-y-2 w-full">
                <div className="flex justify-between">
                    <div className="text-[#6e767d]">
                        <div className="inline-block group">
                            <h4 className="font-bold text-[#d9d9d9] text-[15px] sm:text-base inline-block group-hover:underline">
                                {comment?.username}
                            </h4>
                            <span className="ml-1.5 text-sm sm:text-[15px]">
                                @{comment?.tag}
                            </span>
                        </div>
                        <span className="text-gray-300 mx-1">·</span>
                        <small className="text-gray-400 hover:underline">
                            <Moment fromNow>
                                {comment?.timestamp?.toDate()}
                            </Moment>
                        </small>
                        <p className="text-[#d9d9d9] mt-0.5 max-w-lg overflow-scroll text-[15px] sm:text-base">
                            {comment?.comment}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Comment;