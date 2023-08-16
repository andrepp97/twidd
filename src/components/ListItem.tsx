import Link from 'next/link'
import Image from "next/image"

interface ListItemProps {
    data: {
        id: string,
        username: string,
        userImg: string,
        tag: string,
    }
    onClickFunction: Function
}

const ListItem = ({ data, onClickFunction }: ListItemProps) => {
    return (
        <Link
            key={data.id}
            passHref={true}
            onClick={() => onClickFunction()}
            href={"/profile/" + data?.id}
            className="hover:bg-zinc-700 flex rounded gap-x-2 px-2 py-1"
        >
            <Image
                className="rounded-full w-auto"
                src={data?.userImg}
                height={36}
                width={36}
                alt=""
            />
            <div>
                <h4 className='font-semibold text-zinc-300'>
                    {data?.username}
                </h4>
                <p className='text-gray-400 text-xs'>
                    @{data?.tag}
                </p>
            </div>
        </Link>
    );
}

export default ListItem;