import { SessionProvider } from "next-auth/react"
import { SSRProvider } from 'react-bootstrap';
import { useEffect } from 'react';

import 'bootstrap/dist/css/bootstrap.min.css';
import '@/styles/globals.css'

export default function App({ Component, pageProps: { session, ...pageProps } }) {
  useEffect(() => {
    import("bootstrap/dist/js/bootstrap");
  }, []);
  
  return (
    <SessionProvider session={session}>
      <SSRProvider>
        <Component {...pageProps} />
      </SSRProvider>
    </SessionProvider>
  )
}
