import Link from "next/link"

const NotFound = () => {
    return (
        <div className="text-gray-300 h-screen w-auto flex flex-col items-center justify-center space-y-2 p-4">
            <p className="text-2xl">
                Ooopss...
            </p>
            <p>
                The page you are looking was not found
            </p>
            <br />
            <Link href="/" passHref={true}>
                <button className="bg-embed rounded-md px-4 py-2 hover:bg-zinc-700 active:bg-embed transition-all duration-150">
                    Return to Home
                </button>
            </Link>
        </div>
    );
}

export default NotFound;