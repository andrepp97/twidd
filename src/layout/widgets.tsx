import { SearchIcon } from "@heroicons/react/outline"
import { TwitterTimelineEmbed } from "react-twitter-embed"

const Widgets = () => {
    return (
        <div className="border-l border-zinc-700 space-y-4 p-4 pt-4 hidden lg:inline col-span-2 overflow-auto">

            {/* Search */}
            <div className="flex items-center rounded-full space-x-2 px-4 py-2 bg-embed text-gray-400">
                <SearchIcon className="h-5 w-5" />
                <input
                    type="search"
                    placeholder="Search Tweetme"
                    className="flex-1 outline-none bg-transparent placeholder:text-gray-400"
                />
            </div>

            {/* Embed */}
            <TwitterTimelineEmbed
                theme="dark"
                sourceType="profile"
                screenName="elonmusk"
            />

        </div>
    );
}

export default Widgets;