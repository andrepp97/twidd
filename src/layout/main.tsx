import { useSession } from "next-auth/react";
import Sidebar from "./sidebar";
import Widgets from "./widgets";

interface LayoutProps {
    children: React.ReactNode
}

const Main = ({ children }: LayoutProps) => {
    // Hooks
    const { data: session } = useSession()

    // Render
    return (
        <main className='lg:max-w-7xl mx-auto'>
            <div className="flex">
                {session && <Sidebar />}
                <main className='grid grid-cols-6 w-full max-h-screen overflow-y-hidden'>
                    <div className={`col-span-6 ${session && "lg:col-span-4"} overflow-auto`}>
                        {children}
                    </div>
                    {session && <Widgets />}
                </main>
            </div>
        </main>
    );
}

export default Main;