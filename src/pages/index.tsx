import type { NextPage } from 'next'
import { RefreshIcon } from '@heroicons/react/outline'
import TweetBox from '../components/tweetBox'

const Home: NextPage = () => {
    return (
        <div>
            {/* Header */}
            <div className='text-zinc-100 flex items-center justify-between pr-2 mt-2 overflow-auto'>
                <h1 className='text-xl font-semibold p-4'>
                    Home
                </h1>
                <button className='rounded-full hover:bg-embed p-2 group'>
                    <RefreshIcon
                        className='w-6 h-6 cursor-pointer transition-all duration-300 ease-out group-hover:rotate-180 group-hover:text-zinc-100 group-active:scale-125'
                    />
                </button>
            </div>

            {/* Feeds */}
            <TweetBox />
        </div>
    )
}

export default Home
