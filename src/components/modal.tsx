import { Fragment } from "react"
import { useRecoilState } from "recoil"
import { Dialog, Transition } from "@headlessui/react"
import { XIcon } from "@heroicons/react/outline"
import { modalState } from "../atoms/modalAtom"

const Modal = ({ children }: any) => {
    // Hooks
    const [isOpen, setIsOpen] = useRecoilState(modalState)

    // Render
    return (
        <Transition.Root show={isOpen ? true : false} as={Fragment}>
            <Dialog
                as="div"
                onClose={() => setIsOpen("")}
                className="fixed z-50 inset-0 sm:pt-10"
            >
                <div className="flex items-start justify-center min-h-[800px] sm:min-h-screen pb-20 text-center sm:block sm:p-4">
                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0"
                        enterTo="opacity-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100"
                        leaveTo="opacity-0"
                    >
                        <Dialog.Overlay className="fixed inset-0 bg-[#5b7083] bg-opacity-40 transition-opacity" />
                    </Transition.Child>

                    <Transition.Child
                        as={Fragment}
                        enter="ease-out duration-300"
                        enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                        enterTo="opacity-100 translate-y-0 sm:scale-100"
                        leave="ease-in duration-200"
                        leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                        leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                    >

                        <div className="bg-zinc-900 inline-block align-bottom sm:rounded-2xl text-left shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-xl w-full">

                            <div className="flex items-center p-2 border-b border-gray-700">
                                <div
                                    onClick={() => setIsOpen("")}
                                    className="flex items-center justify-center cursor-pointer group"
                                >
                                    <XIcon className="w-8 h-8 rounded-full text-white group-hover:bg-gray-700 p-1" />
                                </div>
                            </div>

                            {children}

                        </div>

                    </Transition.Child>
                </div>
            </Dialog>
        </Transition.Root>
    );
}

export default Modal;