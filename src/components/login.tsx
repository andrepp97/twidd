import Image from "next/image"
import { useState } from "react"
import { signIn } from "next-auth/react"
import GoogleIcon from "../../public/google.png"
import Logo from "../../public/twitter.png"
import Spinner from "./spinner"

interface ProviderProps {
    providers: {
        id: any
        name: any
    }
}

const Login = ({ providers }: ProviderProps) => {
    // State
    const [loading, setLoading] = useState(false)

    // Function
    const userLogin = (id: string) => {
        setLoading(true)
        signIn(id, { callbackUrl: "/" })
            .finally(() => setLoading(false))
    }

    // Render
    return (
        <div className="h-screen w-full flex gap-10 flex-col items-center justify-center">
            <Image
                alt=""
                src={Logo}
                width={150}
                height={120}
            />
            {Object.values(providers).map((provider, index) => (
                <button
                    key={index}
                    disabled={loading}
                    onClick={() => userLogin(provider.id)}
                    className="flex items-center gap-4 text-xl text-white bg-gray-800 px-8 py-4 hover:bg-gray-700 rounded-xl disabled:opacity-50"
                >
                    <Image
                        src={GoogleIcon}
                        height={40}
                        width={40}
                        alt=""
                    />
                    {
                        loading
                            ? <Spinner />
                            : (
                                <span>
                                    Login With {provider.name}
                                </span>
                            )
                    }
                </button>
            ))}
        </div>
    );
}

export default Login;