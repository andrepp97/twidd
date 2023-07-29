import Head from 'next/head'
import type { AppProps } from 'next/app'
import { SessionProvider } from 'next-auth/react'
import { RecoilRoot } from 'recoil'
import Main from '../layout/main'
import '../styles/globals.css'
import 'emoji-mart/css/emoji-mart.css'
import 'react-medium-image-zoom/dist/styles.css'

const meta = {
    keywords: "twitter, social, media, tweet, twitme, chat, nextjs, react, tailwind, css, firebase",
    description: "Share your opinion, because you can.",
}

const MyApp = ({ Component, pageProps: { session, ...pageProps } }: AppProps) => {
    return (
        <div className='bg-zinc-900'>
            <Head>
                <title>Home / Twidd</title>
                <link rel="icon" href="/favicon.png" />
                <meta name="keywords" content={meta.keywords} />
                <meta name="description" content={meta.description} />
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
