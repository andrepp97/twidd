import Head from 'next/head'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import Main from '../layout/main'
import '../styles/globals.css'
import 'emoji-mart/css/emoji-mart.css'

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
    return (
        <div className='bg-zinc-900'>
            <Head>
                <title>Tweetme</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <SessionProvider session={session}>
                <RecoilRoot>
                    <Main>
                        <Component {...pageProps} />
                    </Main>
                </RecoilRoot>
            </SessionProvider>
        </div>
    )
}

export default MyApp
