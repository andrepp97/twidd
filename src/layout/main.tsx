import Sidebar from "./sidebar";
import Widgets from "./widgets";

interface LayoutProps {
    children: React.ReactNode;
}

const Main = ({ children }: LayoutProps) => {
    return (
        <main className='lg:max-w-7xl mx-auto'>
            <div className="flex">
                <Sidebar />
                <main className='grid grid-cols-6 w-full max-h-screen overflow-y-hidden'>
                    <div className='col-span-6 lg:col-span-4 overflow-auto px-2'>
                        {children}
                    </div>
                    <Widgets />
                </main>
            </div>
        </main>
    );
}

export default Main;