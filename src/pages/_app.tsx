import type { AppProps } from 'next/app'
import Head from 'next/head'
import Main from '../layout/main'
import '../styles/globals.css'

const MyApp = ({ Component, pageProps }: AppProps) => {
    return (
        <div className='bg-zinc-900'>
            <Head>
                <title>Tweetme</title>
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Main>
                <Component {...pageProps} />
            </Main>
        </div>
    )
}

export default MyApp
