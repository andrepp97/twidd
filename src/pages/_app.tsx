import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import Head from 'next/head'
import Main from '../layout/main'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps: {session, ...pageProps} }: AppProps) => {
    return (
        <div className='bg-zinc-900'>
            <Head>
                <title>Tweetme</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SessionProvider session={session}>
                <Main>
                    <Component {...pageProps} />
                </Main>
            </SessionProvider>
        </div>
    )
}

export default MyApp
